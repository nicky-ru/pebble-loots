import React from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Box, Button, Flex, Heading, Stack, useDisclosure } from '@chakra-ui/react';
import { RecordList } from '@/components/Records/rec-list';
import { useStore } from '@/store/index';
import { MintModal } from '@/components/DPLoots/MintModal';
import { BooleanState } from '@/store/standard/base';
import { TransactionResponse } from '@ethersproject/providers';

export const Records = observer(() => {
  const { rec, pebble, god, dpLoot } = useStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const observable = useLocalObservable(() => ({
    recordToMint: 0,
    setRecordToMint(value: number) {
      this.recordToMint = value;
    }
  }))
  return (
    <Flex mt={4}>
      <Box w="15%">
        <Heading size={'md'} align={'center'}>Device list</Heading>
        <Stack mt={4}>
          {pebble.devices?.map((device, i) => (
            <Button
              variant={"ghost"}
              key={device.address}
              onClick={() => {pebble.selectImei(device.id)}}
            >
              {device.name}
            </Button>
          ))}
        </Stack>
      </Box>
      <Box flex="1">
        <RecordList onOpen={onOpen} setRecordToMint={observable.setRecordToMint}/>
      </Box>
      <MintModal isOpen={isOpen} onClose={onClose} recordToMint={observable.recordToMint}/>
    </Flex>
  );
});
