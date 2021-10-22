import React, { useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Container, Heading, Text, Button, Box } from '@chakra-ui/react';
import { DPLoots } from '@/components/DPLoots';
import { useStore } from '@/store/index';
import axios from 'axios';
import { BooleanState } from '@/store/standard/base';
import { SedimentCards } from '@/components/Sediments/SedimentCards';

const IOTX_TEST_CHAINID = 4690;

export const Sediments = observer(() => {
  const { dpLoot, god, stash } = useStore();

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
      tokenIds[i] = await dpLoot.contracts[god.currentChain.chainId].tokenOfOwnerByIndex({params: [dpLoot.god.currentNetwork.account, i]})
    }
    const tokenUris = await Promise.all(tokenIds.map(async (tid) => {
      const uri = await dpLoot.contracts[god.currentChain.chainId].getTokenUri({params: [tid.toNumber()]});
      return await axios.get(uri.toString());
    }))

    dpLoot.setTokenUris(tokenUris);
    observable.setLoading(false);
    observable.setLoaded(true);
  }

  async function approve() {
    try {
      await dpLoot.contracts[god.currentChain.chainId].setApprovalForAll({
        params: [stash.contracts[god.currentChain.chainId].address, true]
      });
    } catch (e) {
      alert(JSON.stringify(e.data.message))
    }
  }

  async function deposit(tokenId) {
    try {
      const tx = await stash.contracts[god.currentChain.chainId].deposit({
        params: [tokenId]
      })
      await tx.wait(1);
      dpLoot.updateBalance();
    } catch (e) {
      alert(JSON.stringify(e.data.message))
    }
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
        {/*<DPLoots/>*/}
        <SedimentCards loading={observable.loading} loaded={observable.loaded} approve={approve} deposit={deposit}/>
      </Box>
    </Container>
  )
});
