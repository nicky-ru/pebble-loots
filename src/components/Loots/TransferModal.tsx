import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button
} from "@chakra-ui/react"
import { TransferForm } from '@/components/TransferForm';

interface PropsType {
  isOpen: boolean;
  onClose: any;
  tokenToTransfer: string;
}

export const TransferModal = observer((props: PropsType) => {
  return(
    <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered size={"lg"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Loot transfer</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <TransferForm tokenToTransfer={props.tokenToTransfer}/>
        </ModalBody>

      </ModalContent>
    </Modal>
  );
});
