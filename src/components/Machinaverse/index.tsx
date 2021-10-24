import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Button, Container, Heading, Text, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { MyLoots } from '@/components/Loots';
import { Minting } from '@/components/Minting';

export const Machinaverse = observer(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Container maxW={'full'} align={'Center'}>
      <Heading>Welcome to your Machinaverse</Heading>
      <Text my={4}>You are the Master. There is enormous power in your hands. To make "something" be "someone".</Text>
      <Button my={4} onClick={onOpen}>
        Awake a new Pebble Tracker
      </Button>
      <Box borderWidth={'thin'} borderColor={'teal'} borderRadius={'3xl'} p={8} m={8}>
        <MyLoots />
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size={'3xl'} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Awake your Pebble Soul in the Machinaverse</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Minting />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
});
