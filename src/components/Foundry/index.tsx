import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Heading, Text, Button, Box, Stack } from '@chakra-ui/react';
import { useStore } from '@/store/index';
import { PlasmaInfoBox } from '@/components/Foundry/PlasmaInfoBox';
import { HashpowerInfoBox } from '@/components/Foundry/HashpowerInfoBox';

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
    <Container minW={'full'} align={'center'}>
      <Heading>The Foundry</Heading>
      <Text my={4}>The Foundry is where precious Plasma is produced and collected.</Text>

      <Box borderWidth={'thin'} borderColor={'teal'} borderRadius={'3xl'} p={8} m={8}>
        <Stack isInline w={'full'} justifyContent={'space-between'}>
          <PlasmaInfoBox/>
          <HashpowerInfoBox/>
        </Stack>

        <Button
          mt={8}
          onClick={() => {
            tabs.setTabIndex(1);
          }}
        >
          Visit your Machinaverse
        </Button>

      </Box>
    </Container>
  );
});
