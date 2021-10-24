import ReactDOM from 'react-dom';
import React from 'react';
import { HashRouter } from 'react-router-dom';
import App from './index';
import { Buffer } from 'buffer';
(globalThis as any).Buffer = Buffer;

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
