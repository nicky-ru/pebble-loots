import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Button, Container, Stack, Text } from '@chakra-ui/react';
import { useStore } from '@/store/index';
import BigNumber from 'bignumber.js';

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
        <Text align={'left'}>{
          new BigNumber(stash.pending.toString()).div('1000000000000000000').toString()
        } PMT</Text>
        <Stack isInline justifyContent={'space-between'} align={'center'}>
          <Button onClick={() => {stash.collect()}}>Collect</Button>
          <Button onClick={() => {stash.updatePending()}}>Refresh</Button>
          <Button onClick={() => {stash.updatePool()}}>Update Pool</Button>
          <Text>10$</Text>
        </Stack>
      </Stack>
    </Box>
  );
});
