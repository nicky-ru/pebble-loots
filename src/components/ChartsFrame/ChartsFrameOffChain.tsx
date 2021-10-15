import React, { useEffect, useState } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import {
  useDisclosure,
  Button,
  Container,
  Stack,
  Box,
  Center,
  Divider,
  Image,
  LinkBox, LinkOverlay, useColorModeValue
} from '@chakra-ui/react';
import { BooleanState } from '@/store/standard/base';
import { Dashboard } from '@/components/Dashboard';
import { useStore } from '@/store/index';
import Timeout = NodeJS.Timeout;
import { LootDrawerOffChain } from '@/components/ChartsFrame/LootDrawerOffChain';

interface PropsType {
  loading: BooleanState;
  loaded: BooleanState;
  queryRecords: any;
}

export const ChartsFrameOffChain = observer((props: PropsType) => {
  const { pebble, pNft, rec, god, token } = useStore();
  const { isOpen, onOpen, onClose } = useDisclosure();


  const observable = useLocalObservable(() => ({
    activeInterval: 0,
    activateInterval(interval: Timeout) {
      this.activeInterval = interval;
    },
    deactivateInterval() {
      clearInterval(this.activeInterval);
    }
  }))

  useEffect(() => {
    observable.deactivateInterval();
    var queryInterval = setInterval(() => {
      props.queryRecords(pebble.imei)
    }, 5000);
    observable.activateInterval(queryInterval);
  }, [pebble.imei]);

  async function mint() {
    let snr, vbat, latitude, longitude, gasResistance, temperature, pressure, humidity, light, gyroscope, accelerometer, random;
    let dataPoint;
    console.log('trying to mint something');
    if (rec.decodedRecords.length) {
      snr = rec.decodedRecords[rec.decodedRecords.length - 1].snr;
      vbat = rec.decodedRecords[rec.decodedRecords.length - 1].vbat;
      latitude = rec.decodedRecords[rec.decodedRecords.length - 1].latitude;
      longitude = rec.decodedRecords[rec.decodedRecords.length - 1].longitude;
      gasResistance = rec.decodedRecords[rec.decodedRecords.length - 1].gasResistance;
      temperature = rec.decodedRecords[rec.decodedRecords.length - 1].temperature;
      pressure = rec.decodedRecords[rec.decodedRecords.length - 1].pressure;
      humidity = rec.decodedRecords[rec.decodedRecords.length - 1].humidity;
      light = rec.decodedRecords[rec.decodedRecords.length - 1].light;
      gyroscope = rec.decodedRecords[rec.decodedRecords.length - 1].gyroscope;
      accelerometer = rec.decodedRecords[rec.decodedRecords.length - 1].accelerometer;
      random = rec.decodedRecords[rec.decodedRecords.length - 1].random;

      dataPoint = [
        snr, vbat, latitude, longitude, gasResistance, temperature,
        pressure, humidity, light, gyroscope, accelerometer, random
      ].map((sensor) => {return sensor.toString()});
    } else {
      dataPoint = ["1","2","3","4","5","6","7","8","9","10","11","12"];
    }

    // dataPoint = ["1","2","3","4","5","6","7","8","9","10","11","12"];

    console.log("here is the dp", dataPoint);
    try {
      await pNft.contracts[god.currentChain.chainId].claim({
        params: [god.currentNetwork.account, dataPoint]
      })
    } catch (e) {
      alert(JSON.stringify(e.data.message))
    }
  }

  async function approve() {
    try {
      const tokee = token.tokens[god.currentChain.chainId]
        .filter((token) => token.symbol == "PBL")
      await tokee[0].approve({
        params: [pNft.contracts[god.currentChain.chainId].address, 1000]
      });
    } catch (e) {
      alert(JSON.stringify(e.data.message))
    }
  }

  return (
    <>
      <LootDrawerOffChain
        onClose={onClose}
        isOpen={isOpen}
      />
      <Container maxW={"container.xl"}>
        <Center>
          <Box
            borderWidth="3px" rounded="md"
            position={"relative"}
            zIndex={0}
            bg={useColorModeValue("light.100", "dark.100")}
            h={"850px"}
            w={"800px"}
          >
            <Stack>
              <Button variant={"ghost"} colorScheme={"black"} onClick={onOpen}>
                Choose device
              </Button>
              <Button variant={"ghost"} colorScheme={"black"} onClick={() => {approve()}}>
                Approve
              </Button>
              <Button variant={"ghost"} colorScheme={"black"} onClick={() => {mint()}}>
                Mint Last Datapoint
              </Button>
            </Stack>
            <Divider/>
            <Box position={"absolute"} mt={4}>
              <Dashboard/>
            </Box>
          </Box>
        </Center>
      </Container>
    </>
  );
});
