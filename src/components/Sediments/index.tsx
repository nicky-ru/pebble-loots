import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Heading, Text, Box, Skeleton, Wrap } from '@chakra-ui/react';
import { useStore } from '@/store/index';
import { SedimentCards } from '@/components/Sediments/SedimentCards';
import { StakedSediments } from '@/components/Sediments/StakedSediments';

export const Sediments = observer(() => {
  const { dpLoot, god, load } = useStore();

  useEffect(() => {
    fetchLoots();
  }, [god.currentNetwork.account, god.currentChain.chainId, dpLoot.balance]);

  async function fetchLoots() {
    load.setLoading(true);
    if (god.isIotxTestnet) {
      await dpLoot.updateBalance();
    } else {
      dpLoot.setBalance(0);
    }
    await dpLoot.fetchLoots();
    await dpLoot.updateHashPow();
    load.setLoading(false);
  }

  return (
    <Container minW={'full'} align={'center'}>
      <Heading>Your Sediments</Heading>
      <Text my={4}>Put your Sediments into the Foundry to increase the production of Plasma.</Text>
      <Box borderWidth={'thin'} borderColor={'teal'} borderRadius={'3xl'} p={8} m={8} maxH={'70vh'} overflowY={'scroll'}>
        <Skeleton isLoaded={!load.loading.value}>
          <Wrap m={4} justify="start">
            <SedimentCards/>
            <StakedSediments/>
          </Wrap>
        </Skeleton>
      </Box>
    </Container>
  );
});
