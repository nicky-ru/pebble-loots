import React from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Box, useDisclosure, Wrap, WrapItem, Image, Button, Text, Stack, Center } from '@chakra-ui/react';
import { MintModal } from '@/components/Minting/MintModal';
import { useStore } from '@/store/index';

export const VaporCards = observer(() => {
  const { rec } = useStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const observable = useLocalObservable(() => ({
    recordToMint: 0,
    setRecordToMint(value: number) {
      this.recordToMint = value;
    }
  }));

  const vaporColor = (pow: number) => {
    let color;
    if (pow === 1) {
      color = './images/vapor/green.svg';
    } else if (pow === 2) {
      color = './images/vapor/blue.svg';
    }
    return color;
  };

  return (
    <Box maxH={'500px'} overflowY={'scroll'}>
      <Wrap mx={4} spacing="45px">
        {rec.decodedRecords?.map((record, i) => (
          <WrapItem key={i}>
            <Center w={'full'}>
              <Stack>
                <Image h={32} w={32} src={rec.recordPowers ? vaporColor(rec.recordPowers[i]) : './images/vapor/green.svg'} />
                <Text>
                  {record.temperature}°C - {record.humidity}% - {record.pressure}hPa
                </Text>
                <Text>Power: {rec.recordPowers?.[i]}</Text>
                <Button
                  onClick={() => {
                    observable.setRecordToMint(i);
                    onOpen();
                  }}
                >
                  Solidify
                </Button>
              </Stack>
            </Center>
          </WrapItem>
        ))}
      </Wrap>
      <MintModal isOpen={isOpen} onClose={onClose} recordToMint={observable.recordToMint} />
    </Box>
  );
});
