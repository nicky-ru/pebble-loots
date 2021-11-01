import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Button, Container, Heading, Text, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { MyLoots } from '@/components/Loots';
import { Minting } from '@/components/Minting';

export const Machinaverse = observer(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Container maxW={'full'} align={'Center'} p={16}>
      <Heading textColor={'green.500'}>Welcome to your Machinaverse</Heading>
      <Text fontWeight={'semibold'} fontSize={'xl'} textColor={'green.800'}>You are the Master. There is enormous power in your hands. To make "something" be "someone".</Text>
      <Button _hover={{transform: "scale(1.05)"}} mt={4} colorScheme={'green'} size={'lg'} onClick={onOpen} boxShadow={'base'}>
        Awake a new Pebble Tracker
      </Button>
      <Box borderRadius={'3xl'} p={8} m={8} bg={'rgba(228, 249, 255, 0.9)'} boxShadow={'base'}>
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
