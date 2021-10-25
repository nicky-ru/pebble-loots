import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Button, Container, Heading, Text } from '@chakra-ui/react';
import { useStore } from '@/store/index';
import { VaporCards } from '@/components/Vapor/VaporCards';

export const Vapor = observer(() => {
  const { tabs, pebble, rec, load, ploot } = useStore();

  useEffect(() => {
    if (pebble.imei) {
      rec.records.setCurrentId(pebble.imei);
    }
  }, [pebble.imei]);

  useEffect(() => {
    ploot.tokenIds.map((tid) => {
      queryRecords(tid);
    });
    rec.setImeis(ploot.tokenIds)
  }, [ploot.tokenIds])

  const queryRecords = async (imei: string) => {
    load.setLoading(true);
    await rec.queryRecords(imei);
    load.setLoading(false);
  };

  return (
    <Container maxW={'Full'} align={'center'}>
      <Heading>Vapor clouds produced</Heading>
      <Text my={4}>Your Pebble produce Vapor clouds in the Machinaverse</Text>
      <Button
        onClick={() => {
          tabs.setTabIndex(1);
        }}
      >
        Back to souls
      </Button>
      <Box w={'90%'} borderWidth={'thin'} borderColor={'teal'} borderRadius={'3xl'} p={8} m={8}>
        <VaporCards />
      </Box>
    </Container>
  );
});
