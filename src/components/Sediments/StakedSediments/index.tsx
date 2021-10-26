import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  WrapItem,
  Image,
  Button,
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

export const StakedSediments = observer(() => {
  const { dpLoot, stash } = useStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sedimentTid, setTid] = useState<number>(0);

  const wrapItem = (balance: number, tokenIds: Array<number>, hashPower: Array<number>) => {
    if (balance > 0) {
      if (tokenIds && hashPower && tokenIds.length === hashPower.length) {
        return(
          tokenIds?.map((tid, i) => (
            <WrapItem key={tid}>
              <Box w={'200px'} h={'200px'} m={4}>
                <Image src={'./images/sediment/gold.svg'} />
                <Text mt={-8}>Power: {hashPower[i]}</Text>
                <Button
                  variant={'outline'}
                  mt={1}
                  onClick={() => {
                    setTid(tid);
                    onOpen();
                  }}
                >
                  Unstake
                </Button>
              </Box>
            </WrapItem>
          ))
        )
      }
    }
  }

  return (
    <>
      {wrapItem(stash.balance, stash.tokenIds, stash.hashPower)}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Remove Sediment From the Foundry</ModalHeader>
          <ModalCloseButton />
          <ModalBody></ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              onClick={() => {
                dpLoot.withdraw(sedimentTid);
              }}
            >
              Remove
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
});
