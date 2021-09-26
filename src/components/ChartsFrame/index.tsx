import React, { useEffect, useState } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import {
  useDisclosure,
  Button,
  Container,
  Box,
  Center,
  Image,
  LinkBox, LinkOverlay
} from '@chakra-ui/react';
import { BooleanState } from '@/store/standard/base';
import { Link } from 'react-router-dom';
import { TransactionResponse } from '@ethersproject/providers';
import { LootDrawer } from '@/components/ChartsFrame/LootDrawer';
import { Dashboard } from '@/components/Dashboard';
import { useStore } from '@/store/index';
import Timeout = NodeJS.Timeout;

interface PropsType {
  balance: number;
  loading: BooleanState;
  loaded: BooleanState;
  queryRecords: any;
}

export const ChartsFrame = observer((props: PropsType) => {
  const { pebble, ploot } = useStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const observable = useLocalObservable(() => ({
    activeLoot: 0,
    activeInterval: 0,
    setActiveLoot(value: number) {
      this.activeLoot = value;
      const imei = this.getTokenImei(value);
      pebble.selectImei(imei);
    },
    activateInterval(interval: Timeout) {
      this.activeInterval = interval;
    },
    deactivateInterval() {
      clearInterval(this.activeInterval);
    },
    getTokenImei(value: number) {
      return ploot.tokenUris[value].data.name.split("#")[1];
    }
  }))

  useEffect(() => {
    observable.deactivateInterval();
    var queryInterval = setInterval(() => {
      props.queryRecords(observable.getTokenImei(observable.activeLoot))
    }, 5000);
    observable.activateInterval(queryInterval);
  }, [observable.activeLoot]);

  useEffect(() => {
    if (ploot.tokenUris?.length){
      const imei = ploot.tokenUris[0].data.name.split("#")[1];
      pebble.selectImei(imei);
    }
  }, [ploot.tokenUris])

  return (
    <>
      <LootDrawer
        setActiveLoot={observable.setActiveLoot}
        balance={props.balance}
        onClose={onClose}
        isOpen={isOpen}
      />
      <Container maxW={"container.xl"}>
        <Button variant={"outline"} colorScheme={"teal"} onClick={onOpen}>
          Reveal data
        </Button>
        <Center>
          <Box
            borderWidth="3px" rounded="md"
            position={"relative"}
            top={-10}
            zIndex={0}
            bg={"dark.100"}
            h={"800px"}
            w={"800px"}
          >
            <Image position={"absolute"} src={ploot.tokenUris?.[observable.activeLoot]?.data.image}/>
            <Box position={"absolute"} mt={16}>
              <Dashboard/>
            </Box>
          </Box>
        </Center>
      </Container>
    </>
  );
});
