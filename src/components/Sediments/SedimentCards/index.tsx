import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Wrap,
  WrapItem,
  Image,
  Skeleton,
  Button,
  Center,
  Text,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Modal,
  useDisclosure
} from '@chakra-ui/react';
import { useStore } from '@/store/index';

export const SedimentCards = observer(() => {
  const { dpLoot, load } = useStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sedimentTid, setTid] = useState<number>(0);

  const wrapItem = (balance: number, tokenIds: Array<number>, hashPower: Array<number>) => {
    if (balance > 0) {
      if (tokenIds && hashPower && tokenIds.length === hashPower.length) {
        return(
          tokenIds.map((tid, i) => (
            <WrapItem key={tid}>
              <Box w={'200px'} h={'200px'} m={4}>
                <Image src={'./images/sediment/3d.svg'} />
                <Text mt={-8}>Power: {hashPower[i]}</Text>
                <Button
                  variant={'outline'}
                  mt={1}
                  onClick={() => {
                    setTid(tid);
                    onOpen();
                  }}
                >
                  Put in the Foundry
                </Button>
              </Box>
            </WrapItem>
          ))
        )
      }
    } else {
      return (
        <WrapItem>
          <Center h={'200px'} flexDirection={'column'}>
            <Text>Empty list</Text>
          </Center>
        </WrapItem>
      )
    }
  }

  return (
    <>
      <Skeleton isLoaded={!load.loading.value}>
        <Wrap m={4} justify="start">
          {wrapItem(dpLoot.balance, dpLoot.tokenIds, dpLoot.hashPow)}
        </Wrap>
      </Skeleton>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Put Sediment in the Foundry</ModalHeader>
          <ModalCloseButton />
          <ModalBody></ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                dpLoot.approve();
              }}
            >
              Approve
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                dpLoot.deposit(sedimentTid);
              }}
            >
              Put
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
});
