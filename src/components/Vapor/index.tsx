import React, { useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Box, Button, Container, Heading, Text } from '@chakra-ui/react';
import { useStore } from '@/store/index';
import { BooleanState } from '@/store/standard/base';
import axios from 'axios';
import { VaporCards } from '@/components/Vapor/VaporCards';

export const Vapor = observer(() => {
  const { tabs, pebble, rec, god } = useStore();

  const observable = useLocalObservable(() => ({
    loaded: new BooleanState(),
    loading: new BooleanState(),
    setLoading(newLoading: boolean) {
      this.loading.setValue(newLoading);
    },
    setLoaded(newLoaded: boolean) {
      this.loaded.setValue(newLoaded);
    }
  }));

  useEffect(() => {
    if (pebble.imei) {
      queryRecords(pebble.imei);
    }
  }, [pebble.imei]);

  useEffect(() => {
    fetchDevices();
  }, [god.currentNetwork.account]);

  useEffect(() => {
    if (rec.decodedRecords) {
      updatePowers();
    }
  }, [rec.decodedRecords]);

  async function updatePowers() {
    observable.setLoading(true);
    const powers = await Promise.all(
      rec.decodedRecords.map(async (record, i) => {
        const pow = await rec.calculateHashPower(i);
        return pow;
      })
    );

    rec.setPowers(powers);
    observable.setLoading(false);
  }

  async function fetchDevices() {
    observable.setLoading(true);
    const owner = god.currentNetwork.account;
    const url = 'https://protoreader.herokuapp.com/api/my-devices/' + owner.toLowerCase();
    const axiosResponse = await axios.get(url);
    pebble.setDevices(axiosResponse.data);
    observable.setLoading(false);
  }

  const queryRecords = async (imei: string) => {
    observable.setLoading(true);
    console.log('querying data for: ', imei);
    const data = await axios.get(`https://protoreader.herokuapp.com/api/devices/${imei}`);
    rec.setDecodedRecords(data.data.decoded);
    observable.setLoading(false);
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
