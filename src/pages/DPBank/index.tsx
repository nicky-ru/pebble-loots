import React, { useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Container, Flex, Box, Button, Stack, Heading, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { useStore } from '@/store/index';
import axios from 'axios';
import { BooleanState } from '@/store/standard/base';
import { RecordList } from '@/components/Records/rec-list';
import { DPLoots } from '@/components/DPLoots';
import { Stash } from '@/components/DPLoots/Stash';
import { Records } from '@/components/Records';

export const DPBank = observer(() => {
  const { rec, pebble, god, dpLoot } = useStore();

  const observable = useLocalObservable(() => ({
    loaded: new BooleanState(),
    loading: new BooleanState(),
    setLoading(newLoading: boolean) {
      this.loading.setValue(newLoading);
    },
    setLoaded(newLoaded: boolean) {
      this.loaded.setValue(newLoaded);
    }
  }))

  useEffect(() => {
    if (pebble.imei) {
      queryRecords(pebble.imei)
    }
  }, [pebble.imei]);

  useEffect(() => {
    fetchDevices();
  }, [god.currentNetwork.account]);

  async function fetchDevices() {
    observable.setLoading(true);
    const owner = god.currentNetwork.account;
    const url = "https://protoreader.herokuapp.com/api/my-devices/" + owner.toLowerCase();
    const axiosResponse = await axios.get(url);
    pebble.setDevices(axiosResponse.data);
    observable.setLoading(false);
  }

  const queryRecords = async (imei: string) => {
    observable.setLoading(true);
    console.log("querying data for: ", imei);
    const data = await axios.get(`https://protoreader.herokuapp.com/api/devices/${imei}`);
    // const data = await axios.get(`http://localhost:3001/api/devices/${imei}`);
    rec.setDecodedRecords(data.data.decoded);
    console.log(data.data)
    observable.setLoading(false);
  }

  return(
    <Container maxW={'container.xl'} mt={16}>
      <Heading align={'center'}>Datapoint Bank</Heading>
      <Tabs variant={'enclosed'} isFitted mt={4}>
        <TabList>
          <Tab>Raw</Tab>
          <Tab>Minted</Tab>
          <Tab>Stashed</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Records/>
          </TabPanel>
          <TabPanel>
            <DPLoots/>
          </TabPanel>
          <TabPanel>
            <Stash/>
          </TabPanel>
        </TabPanels>
      </Tabs>

    </Container>
  );
});
