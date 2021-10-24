import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Image } from '@chakra-ui/react';
import { BooleanState } from '@/store/standard/base';
import { Dashboard } from '@/components/Dashboard';
import { useStore } from '@/store/index';

interface PropsType {
  balance: number;
  loading: BooleanState;
  loaded: BooleanState;
  queryRecords: any;
}

export const ChartsFrame = observer((props: PropsType) => {
  const { pebble, ploot } = useStore();

  return (
    <Box position={'relative'} zIndex={0}>
      <Image rounded="md" position={'absolute'} zIndex={-1} src={ploot.tokenUris?.[pebble.lootId]?.data.image} />
      <Box pt={14}>
        <Dashboard />
      </Box>
    </Box>
  );
});
