import ReactDOM from 'react-dom';
import React from 'react';
import { HashRouter } from 'react-router-dom';
import { ColorModeScript } from "@chakra-ui/react"
import { theme } from "@/lib/theme"
import App from './index';
import { Buffer } from 'buffer';
(globalThis as any).Buffer = Buffer;

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <App />
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
