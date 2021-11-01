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
  Modal, useToast,
  useDisclosure, ListItem, Spinner
} from '@chakra-ui/react';
import { useStore } from '@/store/index';
import VirtualList from 'react-tiny-virtual-list';
import { helper } from '@/lib/helper';

export const StakedSediments = observer(() => {
  const toast = useToast();
  const { dpLoot, stash } = useStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sedimentTid, setTid] = useState<number>(0);
  const [uriId, setUriId] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const wrapItem = (balance: number, tokenIds: Array<number>, hashPower: Array<number>) => {
    if (balance > 0) {
      if (tokenIds && hashPower && tokenIds.length === hashPower.length) {
        return(
          <VirtualList width={'full'} height={600} itemCount={tokenIds.length} itemSize={50} renderItem={({index}) => {

            return(
              <ListItem
                size={'xl'}
                pl={2}
                my={2}
                key={index}
                cursor="pointer"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                onClick={() => {
                  setUriId(index);
                  setTid(tokenIds[index]);
                  onOpen();
                }}
              >
                <Button _hover={{transform: "scale(1.1)"}} variant={'link'}>Sediment #{tokenIds[index]}, Power: {hashPower[index]}</Button>
              </ListItem>
            )
          }}/>
        )
      }
    }
  }

  const withdraw = async (sedimentTid: number) => {
    setLoading(true);

    const [err, res] = await helper.promise.runAsync(
      dpLoot.withdraw(sedimentTid)
    )

    if (err) {
      toast({
        title: "Transaction reverted.",
        // @ts-ignore
        description: err.data.message,
        status: 'warning',
        duration: 9000,
        isClosable: true,
      })
    } else {
      const receipt = await res.wait();
      if (receipt.status) {
        toast({
          title: "Sediment has been withdrawn",
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
        dpLoot.updateBalance();
        stash.updateUserInfo();
      }
    }

    setLoading(false);
  }

  return (
    <>
      {wrapItem(stash.balance, stash.tokenIds, stash.hashPower)}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sediment info</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {stash.tokenUris?.length > uriId ? <Image src={stash.tokenUris[uriId].data.image}/> : <Text>No token info</Text>}
          </ModalBody>

          <ModalFooter>
            {
              loading ?
                <Button>
                  <Spinner />
                </Button> :
                <Button
                  variant="ghost"
                  onClick={() => {
                    withdraw(sedimentTid);
                  }}
                >
                  Remove from the foundry
                </Button>
            }
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
});
