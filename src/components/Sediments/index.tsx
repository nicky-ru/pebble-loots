import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Heading, Text, Box } from '@chakra-ui/react';
import { useStore } from '@/store/index';
import { SedimentCards } from '@/components/Sediments/SedimentCards';

export const Sediments = observer(() => {
  const { dpLoot, god, load } = useStore();

  useEffect(() => {
    if (god.isIotxTestnet) {
      dpLoot.updateBalance();
    } else {
      dpLoot.setBalance(0);
    }
  }, [god.currentNetwork.account, god.currentChain.chainId]);

  useEffect(() => {
    if (dpLoot.balance) {
      fetchLoots();
    }
  }, [dpLoot.balance]);

  async function fetchLoots() {
    load.setLoading(true);
    await dpLoot.fetchLoots();
    await dpLoot.updateHashPow()
    load.setLoading(false);
  }

  return (
    <Container minW={'full'} align={'center'}>
      <Heading>Your Sediments</Heading>
      <Text my={4}>Put your Sediments into the Foundry to increase the production of Plasma.</Text>
      <Box borderWidth={'thin'} borderColor={'teal'} borderRadius={'3xl'} p={8} m={8}>
        <SedimentCards/>
      </Box>
    </Container>
  );
});
