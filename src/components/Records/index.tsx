import React from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Box, useDisclosure } from '@chakra-ui/react';
import { RecordList } from '@/components/Records/rec-list';
import { useStore } from '@/store/index';
import { MintModal } from '@/components/DPLoots/MintModal';

export const Records = observer(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const observable = useLocalObservable(() => ({
    recordToMint: 0,
    setRecordToMint(value: number) {
      this.recordToMint = value;
    }
  }))
  return (
    <Box maxH={'500px'} overflowY={'scroll'} overflowX={'visible'}>
      <RecordList onOpen={onOpen} setRecordToMint={observable.setRecordToMint}/>
      <MintModal isOpen={isOpen} onClose={onClose} recordToMint={observable.recordToMint}/>
    </Box>
  );
});
