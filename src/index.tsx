import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { useStore } from '@/store/index';
import { Header } from '@/components/Header';
import { ChakraProvider, Alert, AlertIcon, Link, Text } from '@chakra-ui/react';
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
            <Alert status="warning">
              <AlertIcon />
              <Text>
                SEP 27, 2021 08:31 UTC: Due to Heroku Database availability issues,
                there may be some problems with data fetching. Join our {" "}
                <Link href={"https://discord.gg/UPkurTvc"}>Discord</Link> channel for more info.
              </Text>
            </Alert>
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
