import React, { useEffect } from 'react';
import { observer, useLocalObservable, useLocalStore } from 'mobx-react-lite';
import {
  Container,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Heading,
  createStandaloneToast, Text, Center
} from '@chakra-ui/react';
import { useStore } from '@/store/index';
import BigNumber from 'bignumber.js';
import { ErrorFallback } from '@/components/ErrorFallback';
import { ErrorBoundary } from 'react-error-boundary';
import { MintForm } from '@/components/MintForm';
import { metamaskUtils } from '@/lib/metaskUtils';

const toast = createStandaloneToast();

export const Minting = observer(() => {
  const { ploot, god } = useStore();

  const store = useLocalStore(() => ({
    async setChain(val) {
      const chain = god.currentNetwork.chain.map[val];
      console.log(chain);
      if (chain.networkKey !== 'eth') {
        await metamaskUtils.setupNetwork({
          chainId: chain.chainId,
          blockExplorerUrls: [chain.explorerURL],
          chainName: chain.name,
          nativeCurrency: {
            decimals: chain.Coin.decimals || 18,
            name: chain.Coin.symbol,
            symbol: chain.Coin.symbol
          },
          rpcUrls: [chain.rpcUrl]
        });
        god.setChain(val);
      } else {
        toast({ title: 'Please connect to the  Ethereum network on metamask.', position: 'top', status: 'warning' });
      }
    }
  }));

  const observable = useLocalObservable(() => ({
    chainId: 0,
    setChainId(newChainId: number) {
      this.chainId = newChainId;
    }
  }))

  useEffect(() => {
    if (ploot.god.currentNetwork.account) {
      observable.setChainId(ploot.god.currentChain.chainId);
    }
  }, [ploot.god.currentChain.chainId]);

  async function handleClaim(imei: string) {
    const tokenIdNum = new BigNumber(imei);
    try {
      await ploot.contracts[observable.chainId].claim({
        params: [tokenIdNum.toNumber()]
      })
    } catch (e) {
      alert(JSON.stringify(e.data.message))
    }
  }


  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Container textAlign={"center"} maxW={'container.lg'} mt={10}>
        {observable.chainId === 4690
          ?
          <MintForm
            handleClaim={handleClaim}
          />
          :
          <Center w={"full"} flexDirection={"column"}>
            <Text>This dapp currently works only on IoTeX Testnet</Text>
            <Button colorScheme={"teal"} mt={5} onClick={() => {store.setChain(4690)}}>Switch to IoTeX Testnet</Button>
          </Center>
        }
      </Container>
    </ErrorBoundary>
  );
});
