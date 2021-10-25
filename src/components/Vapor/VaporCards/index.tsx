import React from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Box, useDisclosure, Wrap, WrapItem, Image, Button, Text, Stack, Center } from '@chakra-ui/react';
import { MintModal } from '@/components/Minting/MintModal';
import { useStore } from '@/store/index';
import { DecodedRecord } from '@/store/lib/RecordState';

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
    if (pow === 0) {
      color = './images/vapor/grey.svg';
    } else if (pow === 1) {
      color = './images/vapor/green.svg';
    } else if (pow === 2) {
      color = './images/vapor/blue.svg';
    } else if (pow === 4) {
      color = './images/vapor/eggplant.svg';
    } else if (pow === 8) {
      color = './images/vapor/lila.svg';
    } else if (pow === 16) {
      color = './images/vapor/pink.svg';
    } else if (pow === 32) {
      color = './images/vapor/sea.svg';
    }
    return color;
  };

  const wrapItem = (record: DecodedRecord, power: number, i: number) => {
    return(
      <WrapItem key={i}>
        <Center w={'full'}>
          <Stack>
            <Image h={32} w={32} src={vaporColor(power)} />
            <Text>
              {record.temperature}°C - {record.humidity}% - {record.pressure}hPa
            </Text>
            <Text>Power: {power}</Text>
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
    )
  }

  const oneDevice = (imei: string) => {
    return(
      rec.records.map[imei]?.decodedRecords?.map((record, i) => {
        const power = rec.records.map[imei].powers ? rec.records.map[imei].powers[i] : 0;
        return wrapItem(record, power, i);
        })
    )
  }

  const allDevices = () => {
    return rec.imeis.map((imei) => {
      return rec.records.map[imei]?.decodedRecords?.map((record, i) => {
        const power = rec.records.map[imei].powers ? rec.records.map[imei].powers[i] : 0;
        return wrapItem(record, power, i);
      })
    })
  }

  return (
    <Box maxH={'500px'} overflowY={'scroll'}>
      <Wrap mx={4} spacing="45px">
        {
          rec.records.currentId
            ?
            oneDevice(rec.records.currentId)
            :
            allDevices()
        }
      </Wrap>
      <MintModal isOpen={isOpen} onClose={onClose} recordToMint={observable.recordToMint} />
    </Box>
  );
});
