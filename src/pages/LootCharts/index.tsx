import React, { useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Container, Text, Center, Button, createStandaloneToast } from '@chakra-ui/react';
import { useStore } from '@/store/index';
import { TransactionResponse } from '@ethersproject/providers';
import axios from 'axios';
import { ErrorFallback } from '@/components/ErrorFallback';
import { ErrorBoundary } from 'react-error-boundary';
import { BooleanState } from '@/store/standard/base';
import { metamaskUtils } from '@/lib/metaskUtils';
import { ChartsFrame } from '@/components/ChartsFrame';

const toast = createStandaloneToast();
const IOTX_TEST_CHAINID = 4690;

export const LootCharts = observer(() => {
  const { ploot, god, rec, pebble } = useStore();

  const observable = useLocalObservable(() => ({
    tokenIds: [],
    chainId: 0,
    balance: 0,
    tokenUris: [],
    loaded: new BooleanState(),
    loading: new BooleanState(),
    setChainId(newChainId: number) {
      this.chainId = newChainId;
    },
    setBalance(newBalance: Partial<TransactionResponse>) {
      // @ts-ignore
      this.balance = newBalance.toNumber();
    },
    setTokenUris(newUris) {
      this.tokenUris = newUris;
    },
    setLoading(newLoading: boolean) {
      this.loading.setValue(newLoading);
    },
    setLoaded(newLoaded: boolean) {
      this.loaded.setValue(newLoaded);
    }
  }))

  useEffect(() => {
    if (ploot.god.currentNetwork.account) {
      observable.setChainId(ploot.god.currentChain.chainId);
    }
  }, [ploot.god.currentChain.chainId]);

  useEffect(() => {
    if (observable.chainId === IOTX_TEST_CHAINID) {
      updateBalance();
    }
  }, [ploot.god.currentNetwork.account])

  useEffect(() => {
    if (observable.chainId === IOTX_TEST_CHAINID) {
      updateBalance();
    }
  }, [observable.chainId])

  useEffect(() => {
    if (observable.balance) {
      fetchLoots();
    }
  }, [observable.balance]);

  useEffect(() => {
    if (pebble.imei) {
      queryRecords(pebble.imei)
    }
  }, [pebble.imei])

  const queryRecords = async (imei: string) => {
    observable.setLoading(true);
    console.log("querying data for: ", imei);
    const data = await axios.get(`https://protoreader.herokuapp.com/api/devices/${imei}`);
    // const data = await axios.get(`http://localhost:3001/api/devices/${imei}`);
    rec.setDecodedRecords(data.data.decoded);
    console.log(data.data)
    observable.setLoading(false);
  }

  async function setChain(val) {
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

  async function fetchLoots() {
    observable.setLoading(true)
    const tokenIds = Array(observable.balance);

    for (let i = 0; i < observable.balance; i++) {
      tokenIds[i] = await ploot.contracts[observable.chainId].tokenOfOwnerByIndex({params: [ploot.god.currentNetwork.account, i]})
    }
    const tokenUris = await Promise.all(tokenIds.map(async (tid) => {
      const uri = await ploot.contracts[observable.chainId].getTokenUri({params: [tid.toNumber()]});
      return await axios.get(uri.toString());
    }))

    ploot.setTokenUris(tokenUris);
    observable.setLoading(false);
    observable.setLoaded(true);
  }

  async function updateBalance() {
    const balance = await ploot.contracts[observable.chainId].balanceOf({params: [ploot.god.currentNetwork.account]});
    observable.setBalance(balance);
  }

  return(
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Container maxW={'container.xl'} mt={10}>
        {observable.chainId === IOTX_TEST_CHAINID
          ?
          <ChartsFrame
            balance={observable.balance}
            loading={observable.loading}
            loaded={observable.loaded}
            queryRecords={queryRecords}
          />
          :
          <Center w={"full"} flexDirection={"column"}>
            <Text>This dapp currently works only on IoTeX Testnet</Text>
            <Button colorScheme={"teal"} mt={5} onClick={() => {setChain(IOTX_TEST_CHAINID)}}>Switch to IoTeX Testnet</Button>
          </Center>
        }
      </Container>
    </ErrorBoundary>
  );
});
