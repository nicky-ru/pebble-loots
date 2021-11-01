import React, { useState } from 'react';
import { observer, useLocalStore } from 'mobx-react-lite';
import {
  Box,
  WrapItem,
  Image,
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
  useDisclosure, useToast, Spinner
} from '@chakra-ui/react';
import { useStore } from '@/store/index';
import { BooleanState } from '@/store/standard/base';
import { helper } from '@/lib/helper';

export const SedimentCards = observer(() => {
  const toast = useToast();
  const { dpLoot, stash } = useStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sedimentTid, setTid] = useState<string>('0');
  const [uriId, setUriId] = useState<number>(0);

  const store = useLocalStore(() => ({
    loading: new BooleanState(),
    staking: new BooleanState(),
    isApproved: new BooleanState()
  }))

  const wrapItem = (balance: number, tokenIds: Array<number>, hashPower: Array<number>) => {
    if (balance > 0) {
      if (tokenIds && hashPower && tokenIds.length === hashPower.length) {
        return(
          tokenIds?.map((tid, i) => (
            <WrapItem key={tid} _hover={{transform: "scale(1.1)"}}>
              <Box w={'200px'} h={'200px'} m={4}>
                <Image src={'./images/sediment/3d.svg'} />
                <Text mt={-8}>Power: {hashPower[i]}</Text>
                <Button
                  boxShadow={'base'}
                  variant={'outline'}
                  colorScheme={'green'}
                  mt={1}
                  onClick={() => {
                    setUriId(i);
                    setTid(tid.toString());
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

  const approve = async () => {
    store.loading.setValue(true);

    const [err, res] = await helper.promise.runAsync(
      dpLoot.approve()
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
          title: "NFT has been approved",
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
        store.isApproved.setValue(true);
      }
    }
    store.loading.setValue(false);
  }

  const deposit = async (sedimentTid: string) => {
    store.staking.setValue(true);

    const [err, res] = await helper.promise.runAsync(
      dpLoot.deposit(sedimentTid)
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
          title: "Sediment has been put into Foundry",
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
        dpLoot.updateBalance();
        stash.updateUserInfo();
      }
    }
    store.staking.setValue(false);
  }

  return (
    <>
      {wrapItem(dpLoot.balance, dpLoot.tokenIds, dpLoot.hashPow)}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Put Sediment in the Foundry</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            You are about to stake:
            {dpLoot.tokenUris?.length > uriId ? <Image src={dpLoot.tokenUris[uriId].data.image}/> : <Text>No token info</Text>}
          </ModalBody>

          <ModalFooter>
            {
              store.isApproved.value ?
                <Button colorScheme="green" disabled={true} mr={3}>
                  Approved
                </Button> :
                <>
                  {
                    store.loading.value ?
                      <Button colorScheme="green" mr={3}>
                        <Spinner />
                      </Button> :
                      <Button
                        colorScheme="green"
                        mr={3}
                        onClick={approve}
                      >
                        Approve
                      </Button>
                  }
                </>
            }
            {
              store.isApproved.value ?
                <>
                  {
                    store.staking.value ?
                      <Button variant={'ghost'}>
                        <Spinner />
                      </Button>
                      :
                      <Button
                        variant="ghost"
                        onClick={() => {
                          deposit(sedimentTid)}
                        }
                      >
                        Put
                      </Button>
                  }
                </> :
                <Button
                  variant="ghost"
                  disabled={true}
                >
                  Put
                </Button>
            }
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
});
