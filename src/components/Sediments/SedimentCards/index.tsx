import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Grid,
  GridItem,
  Box,
  Heading,
  Stack,
  Wrap,
  WrapItem,
  LinkBox,
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
import { BooleanState } from '@/store/standard/base';
import { useStore } from '@/store/index';

interface PropsType {
  loading: BooleanState;
  loaded: BooleanState;
}

export const SedimentCards = observer((props: PropsType) => {
  const { dpLoot } = useStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sedimentTid, setTid] = useState<number>(0);

  return (
    <>
      <Skeleton isLoaded={!props.loading.value}>
        <Wrap m={4} justify="start">
          {dpLoot.balance ? (
            <>
              {dpLoot.tokenIds?.map((tid, i) => (
                <WrapItem key={tid}>
                  <Box w={'200px'} h={'200px'} m={4}>
                    <Image src={'./images/sediment/3d.svg'} />
                    <Text mt={-8}>Power: {dpLoot.hashPow?.[i]}</Text>
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
              ))}
            </>
          ) : (
            <WrapItem>
              <Center h={'200px'} flexDirection={'column'}>
                <Text>Empty list</Text>
              </Center>
            </WrapItem>
          )}
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
