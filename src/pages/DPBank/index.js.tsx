import React, { useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Container, Flex, Box, Button, Stack, Heading } from '@chakra-ui/react';
import { useStore } from '@/store/index';
import axios from 'axios';
import { BooleanState } from '@/store/standard/base';
import { RecordList } from '@/components/Records/rec-list';

export const DPBank = observer(() => {
  const { rec, pebble, god, pNft } = useStore();

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

  async function mint(id) {
    const snr = rec.decodedRecords[id].snr.toString();
    const vbat = rec.decodedRecords[id].vbat.toString();
    const latitude = rec.decodedRecords[id].latitude.toString();
    const longitude = rec.decodedRecords[id].longitude.toString();
    const gasResistance = rec.decodedRecords[id].gasResistance.toString();
    const temperature = rec.decodedRecords[id].temperature.toString();
    const pressure = rec.decodedRecords[id].pressure.toString();
    const humidity = rec.decodedRecords[id].humidity.toString();
    const light = rec.decodedRecords[id].light.toString();
    const gyroscope = rec.decodedRecords[id].gyroscope.toString();
    const accelerometer = rec.decodedRecords[id].accelerometer.toString();
    const random = rec.decodedRecords[id].random.toString();

    const dataPoint = [
      snr, vbat, latitude, longitude, gasResistance, temperature,
      pressure, humidity, light, gyroscope, accelerometer, random
    ];

    console.log("Minting dp", dataPoint);

    try {
      await pNft.contracts[god.currentChain.chainId].claim({
        params: [god.currentNetwork.account, dataPoint]
      })
    } catch (e) {
      alert(JSON.stringify(e.data.message))
    }
  }

  return(
    <Container maxW={'container.xl'} mt={16}>
      <Heading align={'center'}>Datapoint Bank</Heading>
      <Flex mt={4}>
        <Box w="15%">
          <Heading size={'md'} align={'center'}>Device list</Heading>
          <Stack mt={4}>
            {pebble.devices?.map((device, i) => (
              <Button
                variant={"ghost"}
                key={device.address}
                onClick={() => {pebble.selectImei(device.id)}}
              >
                {device.name}
              </Button>
            ))}
          </Stack>
        </Box>
        <Box flex="1">
          <RecordList mint={mint}/>
        </Box>
      </Flex>
    </Container>
  );
});
