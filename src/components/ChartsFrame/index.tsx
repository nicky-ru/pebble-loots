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

interface PropsType {
  balance: number;
  loading: BooleanState;
  loaded: BooleanState;
}

export const ChartsFrame = observer((props: PropsType) => {
  const { pebble, ploot } = useStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const observable = useLocalObservable(() => ({
    activeLoot: 0,
    setActiveLoot(value: number) {
      this.activeLoot = value;
      console.log("select loot from observable: ", ploot.tokenUris.length)
      const imei = ploot.tokenUris[value].data.name.split("#")[1];
      pebble.selectImei(imei);
    }
  }))

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
        <Button variant={"outline"} onClick={onOpen}>
          Choose Loot
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
              <Dashboard loading={props.loading}/>
            </Box>
          </Box>
        </Center>
      </Container>
    </>
  );
});
