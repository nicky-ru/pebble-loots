import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useStore } from '@/store/index';
import { Header } from '@/components/Header';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '@/lib/theme';
import { ETHProvider } from './components/EthProvider';
import { Home } from './pages/Home';
import { Web3ReactProvider } from '@web3-react/core';
import { getLibrary } from './lib/web3-react';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from 'react-hot-toast';
import { ToolConfig } from './config/ToolConfig';
import { WalletSelecter } from './components/WalletSelecter';
import { Pebble } from './pages/Pebble';
import { ErrorFallback } from '@/components/ErrorFallback';

export const App = observer(() => {
  const { lang, god } = useStore();
  useEffect(() => {
    lang.init();
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <WalletSelecter />
          <ETHProvider />
          <Toaster />
          <Router>
            <Header />
            <Switch>
              <Route path="/" exact key="/">
                <Home key={god.network.currentId.value} />
              </Route>
              {ToolConfig.map((item) => (
                <Route exact path={item.path} key={item.path} component={item.component} />
              ))}
              <Route path={"/devices/:imei"} exact key={"/devices/:imei"}>
                <Pebble/>
              </Route>
            </Switch>
          </Router>
        </Web3ReactProvider>
      </ErrorBoundary>
    </ChakraProvider>
  );
});

export default App;
