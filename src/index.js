require('./index.scss');
const React = require('react');
const ReactDOM = require('react-dom');

const App = function App() {
  return (<div className="App">hello world!</div>);
};

window.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<App />, document.querySelector('#app'));
});
