import React, { useEffect, useState } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import {
  useDisclosure,
  Button,
  Container,
  Box,
  Center,
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
  const { pebble } = useStore();
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

  return (
    <>
      <LootDrawerOffChain
        onClose={onClose}
        isOpen={isOpen}
      />
      <Container maxW={"container.xl"}>
        <Button variant={"outline"} colorScheme={"teal"} onClick={onOpen}>
          Choose device
        </Button>
        <Center>
          <Box
            borderWidth="3px" rounded="md"
            position={"relative"}
            top={-10}
            zIndex={0}
            bg={useColorModeValue("light.100", "dark.100")}
            h={"800px"}
            w={"800px"}
          >
            <Box position={"absolute"} mt={16}>
              <Dashboard/>
            </Box>
          </Box>
        </Center>
      </Container>
    </>
  );
});
