import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Heading, Text, Button, Box, Stack, Wrap } from '@chakra-ui/react';
import { useStore } from '@/store/index';
import { PlasmaInfoBox } from '@/components/Foundry/PlasmaInfoBox';
import { HashpowerInfoBox } from '@/components/Foundry/HashpowerInfoBox';
import { StakedSediments } from '@/components/Sediments/StakedSediments';

export const Foundry = observer(() => {
  const { tabs, stash, god } = useStore();

  useEffect(() => {
    if (god.isIotxTestnet) {
      stash.updateUserInfo();
    } else {
      stash.setUser(0, 0);
    }
  }, [god.currentNetwork.account, god.currentChain.chainId])

  return (
    <Container minW={'full'} align={'center'} pt={16}>
      <Heading textColor={'green.500'}>The Foundry</Heading>
      <Text fontWeight={'semibold'} fontSize={'xl'} textColor={'green.800'}>The Foundry is where precious Plasma is produced and collected.</Text>

      <Box borderRadius={'3xl'} p={8} m={8} bg={'rgba(228, 249, 255, 0.9)'} boxShadow={'base'}>
        <Stack isInline w={'full'} justifyContent={'space-between'}>
          <PlasmaInfoBox/>
          <HashpowerInfoBox/>
        </Stack>

        <Button
          _hover={{transform: "scale(1.1)"}}
          boxShadow={'base'}
          size={'lg'}
          colorScheme={'green'}
          mt={8}
          onClick={() => {
            tabs.setTabIndex(1);
          }}
        >
          Visit your Machinaverse
        </Button>

      </Box>
      <Box borderRadius={'3xl'} p={8} m={8} maxH={'22vh'} overflowY={'hidden'} bg={'rgba(228, 249, 255, 0.9)'} boxShadow={'base'}>
        <Heading align={'left'} size={'md'} textColor={'green.500'}>Your staked sediments</Heading>
        <StakedSediments/>
      </Box>
    </Container>
  );
});
