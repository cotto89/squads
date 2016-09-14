[wip]

用語整理
========
* action: actionの名前またはaction関数
* evnet: `'context.action'`
* payload: eventと値のセット

API
====

Squad(options)
---------

### options: `Object`

#### context: `string`

* **required**

squadに一意な名前を登録します。contextはacitonの名前とセット(`'context.action'`)でアプリケーションの**event**になります。

viewから`dispatch`関数を使って`dispatch('context.action')`のようにsquadのactionを叩くことができます。またsubscribeオプションでSharedActionや他のSquadのactionの実行を監視する場合に使われます。


#### state: `Object`

* default: `{}`

squad内のstateになります。


#### actions: `Object`

* default: `{}`

actionを登録します。actionはviewからdispatchされた値と現在のstateを参照して次のstateを返す関数です。actionが新しいstateを返すとstateが更新され、eventとしてpublishされます。またviewに対して更新されたstateがdispatchされます。

actionが`false`を返す、または`Squad#prevent`を呼ぶとactionの更新を無効にできます。この場合stateは更新されず、viewへstateをdispatchさせません。また、eventがpublishされません。

stateは更新するがeventのpublishやstateのdispatchをしたくない場合は、`Squad#setState`を呼び出して手動でstateを更新だけを行うことができます。

Reduxやその他のfluxフレームワーク同様にstateの操作はimmutableに扱うように気をつけてください。

actionsに登録した関数はSquadの外部から`dispatch('context.action')`で叩くことができます。

以下の例がsquadsの基本的なfluxサイクルです。

```js
import { Squad, store, dispatch } from 'squads';

const counter = new Squad({
  context: 'counter',
  state: { count: 0 },
  actions: {
    increment(count = 1) {
      return { count: this.state.count + count };
    },
    decrement(count = 1) {
      return { count: this.state.count - count }
    },
  }
});

store({ squads: [counter] }).onChange(nextState => {
  console.log(nextState) // => { counter: { count: 10 }}
})

// view
dispatch('counter.increment', 10)
```

Squadはactionの返り値にPromiseを受け付けないことに注意してください。非同期処理は後述する`SharedAction`と`Squad#trigger`を使うか、Promiseの中で`Squad#setState`と`Squad#forceUpdate`を使ってください。

とくに次のstateを作るために非同期Actionが現在のstateを参照する必要がある場合、`SharedAction`を使うことを勧めます。

[非同期処理を受け付けない理由: 非同期Actionと非同期handling · Issue #1 · cotto89/squads](https://github.com/cotto89/squads/issues/1)

```js
import { Squad, store, dispatch, SharedAction } from 'squads';

const counter = new Squad({
  context: 'counter',
  state: { count: 0 },
  actions: {
    // setStateとforceUpdateを使った非同期処理
    increment(count = 1) {
      Promise.resolve(count)
        .then(count => this.setState({count: this.state.count + count}))
        .then(() => this.forceUpdate('increment'));
    },
    // SharedActionを使った非同期処理
    decrement(count = 1) {
      this.trigger('shared.decrement');
    },
  },
  subscribe: {
    // SharedActionを監視
    'shared.decrement': function(count) {
      return { count: this.state.count - count }
    }
  }
});

// SharedActionを作成
const shared = new SharedAction({
  context: 'shared',
  decrement(count = 1) {
    return Promise.resolve(count);
  }
})
```

#### subscribe: `Object`

* default: `{}`

`ShareAction`や他のSquadのactionの実行(event)を監視することができます。

subscribe内に登録するcallback関数の挙動はeventをpubslishすること以外はacitonと同様です。次のstateを返せばstateが更新され、stateがviewにdispatchされます。

subscribeはSharedActionを使った非同期ActionやSquad間のstateの依存解決に有効です。

```js
import { Squad, store, dispatch, SharedAction } from 'squads';

const mixin = {
  actions: {
    increment(count = 1) {
      return { count: this.state.count + count };
    },
    decrement(count = 1) {
      return { count: this.state.count - count }
    },
  }
}

const shared = new SharedAction({
  context: 'shared',
  reset() {
    return 0,
  }
})

const counterA = new Squad({
  context: 'counterA',
  state: { count: 0 },
  mixins: [mixin]
});

const counterB = new Squad({
  context: 'counterB',
  state: { count: 0 },
  mixins: [mixin],
  subscribe: {
    // counterAを監視
    'counterA.increment': function(counteAState) {
      const nextState = ...
      return nextState;
    },

    // SharedActionを監視
    'shared.reset': function(count) {
      return { count }
    }
  }
});
```

#### mixins: `Object[]`

optionをmergeすることができます。mixin可能なオプションは`actions`と`subscribe`,  `custom option`のみです。Squadとmixinオブジェクト内でオプションキーのコンフリクトがある場合。Squad内のオプションが優先されます。

##### example

```js
const mixin = {
  actions: {
    reset() {
      return { count: 0 };
    }
  },
};

const counter = new Squad({
  context: 'counter',
  state: { count: 0 },
  mixins: [mixin],
  actions: {
    increment(num = 1) {
      return { count: this.state.count + num };
    }
  }
});

counter.actions.reset() // -> { count: 0 }
```

#### before: `Object`

action毎にactionが実行される直前に呼び出されるcallback関数を登録することができます。

`beforeEach` -> `before`の順番で呼びだされます。

##### callback params

* `{*}` `value` - dispatchされたときに渡された値

##### example

```js
new Squad({
  context: 'counter',
  state: { count: 0 },
  before: {
    // emit before actions.increment
    increment(value) {...}
  },
  actions: {
    increment(count = 0) {
      ...
    }
  }
})
```


#### after: `Object`

action毎にactionが実行された後に呼び出されるcallback関数を登録することができます。callbackに渡される`nextState`は対象のactionが返した値です。このとき`nextState`でSquadのstateがまだ更新されていないことに注意してください。すべてのcallback hookが完了次第stateが更新されます。

`afterEach` -> `after`の順番で呼びだされます。

##### callback params

* `{*}` `nextState` - actionが返した値



#### beforeEach: `Function`

squad内のすべてのactionが実行される直前に呼び出されるcallbackを登録することができます。

`beforeEach` -> `before`の順番で呼びだされます。

##### callback params

* `{string}` `action` - dispatchされたaction name
* `{*}` `value`- dispatchされた値

##### example

```js
new Squad({
  context: 'counter',
  state: { count: 0 },
  beforeEach(action, value) {
    ...
  },
  actions: {
    increment(count = 0) {
      ...
    }
  }
})
```

#### afterEach: `Function`

Squad内のすべてのactionが実行された直後に呼び出されるcallbackを登録することができます。callbackに渡される`nextState`は直前のactionが返した値です。このとき`nextState`でsquadのstateがまだ更新されていないことに注意してください。すべてのcallback hookが完了次第、stateが更新されます。

`afterEach` -> `after`の順番で呼びだされます。

##### callback params

* `{string}` `action` - dispatchされたaction name
* `{*}` `nextState`: actionが返した値



#### custom option

option以外に任意のkeyで関数を登録することができます。オプションに登録する関数と同様にthisが自動でbindされます。

##### example

```js
new Squad({
  context: 'counter',
  state: { count: 0 },
  actions: {
    increment(count = 0) {
      this.custom.log();
      ...
    }
  },
  custom: {
    log() {
      console.log(this.state);
    }
  }
})

```


### instance methods

#### setState(nextState)

stateを手動で更新します。`setState`を使って手動でstateを更新した場合は、viewにstateがdispatchされません。またeventをpublishしません。

##### params

* `{Object}` `nextState`

#### trigger(event, valeu)

SharedActionを実行します。

##### params

* `{string}` `event` - `'context.action'`
* `{*}` `value`


#### forceUpdate(action)

手動でviewにstateをdispatchします。引数にactionを渡した場合、eventをpublishできます。

##### params

* `{string}` `[action]`

#### prevent()

actionの処理を切り上げます。`prevent`が呼ばれるとstateを更新せず、stateがdispatchされません。またeventがpublishされません。また以降のhookも実行されません。


SharedAction
-------------

SharedActionはactionの返り値にPromiseを受け付けます。非同期処理の結果をeventとしてpublishします。SharedActionは非同期で処理されることに注意してください。

### options: `Object`

#### context: `string`

* **required**

SharedActionに一意な名前を登録します。contextはacitonの名前とセット(`'context.action'`)でアプリケーションの**event**になります。

Squadから`trigger`関数を使って`trigger('context.action')`のようにSharedActionのactionを叩くことができます。またSquadがsubscribe可能なeventになります。

#### mixins: `Object[]`

'context'と'mixin'以外のoptionをmergeすることが可能です。keyのコンフリクトがある場合はSharedAction内のオプションが優先されます。

```js
const mixin = {
  actionB() {}
},

const shared = new SharedAction({
  context: 'shared',
  mixins: [mixin],
  actionA() {...}
  ...
});

// Squad.actions.action
this.trigger('shared.actionB');
```

#### example


```js
import { Squad, SharedAction, store, dispatch } from 'squads';

const shared = new SharedAction({
  context: 'shared',
  reset() {
    return Promise.resolve(0),
  }
})
const counter = new Squad({
  context: 'counter',
  state: { count: 0 },
  actions: {
    reset() {
      this.trigger('shared.reset');
    }
  },
  subscribe: {
    'shared.reset': function(count) {
      return { count }
    }
  }
});

const $store = store({
  sqauds: [counter],
  shardActions: [shared]
})

$store.onChange(nextState => {...})

dispatch('counter.reset')
```

store(options)
-------------

SquadやSharedActionの初期化処理を行い、`store.getState`関数と`store.onChange`関数を返します。

### options: `Object`

#### squads: `Array.<Squad>`

squadを登録します。

#### sharedActions: `Array.<SharedAction>`

SharedActionを登録します。

### returns

#### getState()

登録してあるSquadのstateを返します。storeから返されるstate構造は`{ context: { contextState } }`です。


#### onChange(callback)

すべてのSquadのstateの変更を監視します。変更があった場合callbackが呼ばれます。

##### callback params

* `{Object}` `nextState`

### example

```js

const counter = new Squad({...})
const shared = new SharedAction({...})

const $store = store({
  sqauds: [counter],
  shardActions: [shared]
})

$store.getState() //-> { counter: {count: 0 } }
$store.onChange(nextState => {
  console.log(nextState); // -> { counter: { count: 1 } }
})


dispatch('counter.up', 1);
```


dispatch(payload, value)
------------------------

viewからeventをdispatchします。"payload"はeventと値のセットを意味します。

### params

* `{string|Object|Array}` `payload`
* `{*}` value

payloadは3種類の書き方ができます。payload配列は実行順序が保証されます。

```js
// string
dispatch('context.action', value);

// object
dispatch({
  'context.action': value,
  'context.actionB': value
});

// array of object
dispatch([
  { 'context.action': value },
  { 'context.actionB': value }
])
```

Sample
======

sample counter: https://cotto89.github.io/squads/example/counter/
