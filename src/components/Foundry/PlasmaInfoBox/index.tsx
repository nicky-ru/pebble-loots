import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Button, Container, Stack, Text } from '@chakra-ui/react';
import { useStore } from '@/store/index';

export const PlasmaInfoBox = observer(() => {
  const { stash } = useStore();

  useEffect(() => {
    if (stash.userInfo?.numOfTokens) {
      stash.updatePending();
    }
  }, [stash.userInfo]);

  return(
    <Box borderWidth={'thin'} w={'45%'} p={4} borderRadius={'md'}>
      <Stack>
        <Text align={'left'}>Your pending Plasma</Text>
        <Text align={'left'}>{stash.pending.toNumber()} PMT</Text>
        <Stack isInline justifyContent={'space-between'} align={'center'}>
          <Button>Collect</Button>
          <Text>10$</Text>
        </Stack>
      </Stack>
    </Box>
  );
});
