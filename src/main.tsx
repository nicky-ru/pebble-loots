import ReactDOM from 'react-dom';
import React from 'react';
import { BrowserRouter } from "react-router-dom";
import App from './index';
import { Buffer } from 'buffer';
(globalThis as any).Buffer = Buffer;

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
