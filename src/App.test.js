import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

jest.mock('./api/BraintreeAPI');

global.requestAnimationFrame = function(callback) {
  setTimeout(callback, 0);
};

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});
