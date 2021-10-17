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
import { useStore } from '@/store/index';

interface PropsType {
  isOpen: boolean;
  onClose: any;
  recordToMint: number;
}

export const MintModal = observer((props: PropsType) => {
  const { token, god, dpLoot, rec } = useStore();

  async function approve() {
    const pbl = token.tokens[god.currentChain.chainId]
      .filter((token) => token.symbol == "PBL")[0];

    try {
      await pbl.approve({
        params: [dpLoot.contracts[god.currentChain.chainId].address, 1000]
      });
    } catch (e) {
      alert(JSON.stringify(e.data.message))
    }
  }

  return(
    <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered size={"lg"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Mint Datapoint Loot</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          Do you want to mint {props.recordToMint}?
          <Button
            onClick={() => {approve()}}
          >
            Approve
          </Button>
          <Button
            onClick={() => {rec.mint(props.recordToMint)}}
          >
            Mint
          </Button>
        </ModalBody>

      </ModalContent>
    </Modal>
  );
});
