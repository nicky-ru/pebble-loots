import React, { useEffect } from 'react';
import { observer, useLocalObservable, useLocalStore } from 'mobx-react-lite';
import { Container, Button, Grid, GridItem, Center, Text, createStandaloneToast } from '@chakra-ui/react';
import { useStore } from '@/store/index';
import axios from 'axios';
import { BooleanState } from '@/store/standard/base';
import { DPLoots } from '@/components/DPLoots';
import { Stash } from '@/components/DPLoots/Stash';
import { Records } from '@/components/Records';
import { MyLoots } from '@/components/Loots';
import { metamaskUtils } from '@/lib/metaskUtils';

const toast = createStandaloneToast();
const IOTX_TEST_CHAINID = 4690;

export const DPBank = observer(() => {
  const { rec, pebble, god } = useStore();

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
    loaded: new BooleanState(),
    loading: new BooleanState(),
    setLoading(newLoading: boolean) {
      this.loading.setValue(newLoading);
    },
    setLoaded(newLoaded: boolean) {
      this.loaded.setValue(newLoaded);
    }
  }));

  useEffect(() => {
    if (pebble.imei) {
      queryRecords(pebble.imei);
    }
  }, [pebble.imei]);

  useEffect(() => {
    fetchDevices();
  }, [god.currentNetwork.account]);

  async function fetchDevices() {
    observable.setLoading(true);
    const owner = god.currentNetwork.account;
    const url = 'https://protoreader.herokuapp.com/api/my-devices/' + owner.toLowerCase();
    const axiosResponse = await axios.get(url);
    pebble.setDevices(axiosResponse.data);
    observable.setLoading(false);
  }

  const queryRecords = async (imei: string) => {
    observable.setLoading(true);
    console.log('querying data for: ', imei);
    const data = await axios.get(`https://protoreader.herokuapp.com/api/devices/${imei}`);
    // const data = await axios.get(`http://localhost:3001/api/devices/${imei}`);
    rec.setDecodedRecords(data.data.decoded);
    console.log(data.data);
    observable.setLoading(false);
  };

  return (
    <Container maxW={'full'}>
      {god.currentChain.chainId === IOTX_TEST_CHAINID ? (
        <Grid templateColumns="repeat(6, 1fr)" gap={4} mt={10}>
          <GridItem colSpan={1}>
            <MyLoots />
          </GridItem>
          <GridItem colSpan={5}>
            <Records />
          </GridItem>
          <GridItem borderWidth="3px" rounded="md" colSpan={6}>
            <DPLoots />
          </GridItem>
          <GridItem borderWidth="3px" rounded="md" colSpan={6}>
            <Stash />
          </GridItem>
        </Grid>
      ) : (
        <Center w={'full'} flexDirection={'column'}>
          <Text>This dapp currently works only on IoTeX Testnet</Text>
          <Button
            colorScheme={'teal'}
            mt={5}
            onClick={() => {
              store.setChain(IOTX_TEST_CHAINID);
            }}
          >
            Switch to IoTeX Testnet
          </Button>
        </Center>
      )}
    </Container>
  );
});
