import React, { useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Container, Heading, Text, Box } from '@chakra-ui/react';
import { useStore } from '@/store/index';
import axios from 'axios';
import { BooleanState } from '@/store/standard/base';
import { SedimentCards } from '@/components/Sediments/SedimentCards';
import { BigNumber } from 'ethers';

const IOTX_TEST_CHAINID = 4690;

export const Sediments = observer(() => {
  const { dpLoot, god } = useStore();

  const observable = useLocalObservable(() => ({
    loaded: new BooleanState(),
    loading: new BooleanState(),
    setLoading(newLoading: boolean) {
      this.loading.setValue(newLoading);
    },
    setLoaded(newLoaded: boolean) {
      this.loaded.setValue(newLoaded);
    }
  }))

  useEffect(() => {
    if (god.currentChain.chainId === IOTX_TEST_CHAINID) {
      dpLoot.updateBalance();
    }
  }, [dpLoot.god.currentNetwork.account, god.currentChain.chainId])

  useEffect(() => {
    if (dpLoot.balance) {
      fetchLoots();
    }
  }, [dpLoot.balance]);

  async function fetchLoots() {
    observable.setLoading(true)
    const tokenIds = Array(dpLoot.balance);

    for (let i = 0; i < dpLoot.balance; i++) {
      const tid = await dpLoot.contracts[god.currentChain.chainId].tokenOfOwnerByIndex({params: [dpLoot.god.currentNetwork.account, i]})
      tokenIds[i] = BigNumber.from(JSON.parse(JSON.stringify(tid))).toNumber();
    }

    const tokenUris = await Promise.all(tokenIds.map(async (tid) => {
      const uri = await dpLoot.contracts[god.currentChain.chainId].getTokenUri({params: [tid]});
      return await axios.get(uri.toString());
    }))

    dpLoot.setTokenIds(tokenIds);
    dpLoot.setTokenUris(tokenUris);
    observable.setLoading(false);
    observable.setLoaded(true);
  }

  return (
    <Container minW={'full'} align={'center'}>
      <Heading>
        Your Sediments
      </Heading>
      <Text my={4}>
        Put your Sediments into the Foundry to increase the production of Plasma.
      </Text>
      <Box borderWidth={'thin'} borderColor={'teal'} borderRadius={'3xl'} p={8} m={8}>
        <SedimentCards loading={observable.loading} loaded={observable.loaded}/>
      </Box>
    </Container>
  )
});
