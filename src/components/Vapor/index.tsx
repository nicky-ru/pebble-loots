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
    <Container maxW={'Full'} align={'center'} py={16}>
      <Heading textColor={'green.500'}>Discovered Treasures</Heading>
      <Text fontWeight={'semibold'} fontSize={'xl'} textColor={'green.800'}>
        Your Pebble Soul traverses Machinaverse with ultra sound and uses it's extra powers to find treasures hidden in its vastness.
        Only last 100 discovered treasures are available of being picked up.

      </Text>
      <Button
        _hover={{transform: "scale(1.1)"}}
        mt={4} colorScheme={'green'} size={'lg'} boxShadow={'xs'}
        onClick={() => {
          tabs.setTabIndex(1);
        }}
      >
        Back to souls
      </Button>
      <Box boxShadow={'base'} w={'90%'} h={'50vh'} borderRadius={'3xl'} p={8} m={8} bg={'rgba(228, 249, 255, 0.9)'}>
        <VaporCards />
      </Box>
    </Container>
  );
});
