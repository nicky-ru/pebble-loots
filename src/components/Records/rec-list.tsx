import React from 'react';
import { observer } from 'mobx-react-lite';
import { Table, TableCaption, Tbody, Td, Button, Th, Thead, Tr } from '@chakra-ui/react';
import { useStore } from '@/store/index';

interface PropsType {
  mint: any;
}

export const RecordList = observer((props: PropsType) => {
  const { rec } = useStore();

  return(
    <Table size="sm" variant="striped">
      <TableCaption placement={"bottom"}>
        Data points coming from your device will be updated each 5 min
      </TableCaption>
      <Thead>
        <Tr>
          <Th>SNR</Th>
          <Th>VBAT</Th>
          <Th>LATITUDE</Th>
          <Th>LONGITUDE</Th>
          <Th>GAS</Th>
          <Th>TEMP</Th>
          <Th>PRES</Th>
          <Th>HUM</Th>
          <Th>LIGHT</Th>
          <Th>TEMP2</Th>
          <Th>GYRO</Th>
          <Th>ACCEL</Th>
        </Tr>
      </Thead>
      <Tbody>
        {rec.decodedRecords?.map((record, i) => (
          <Tr key={i}>
            <Td>{record.snr?.toString()}</Td>
            <Td>{record.vbat?.toString()}</Td>
            <Td>{record.latitude?.toString()}</Td>
            <Td>{record.longitude?.toString()}</Td>
            <Td>{record.gasResistance?.toString()}</Td>
            <Td>{record.temperature?.toString()}</Td>
            <Td>{record.pressure?.toString()}</Td>
            <Td>{record.humidity?.toString()}</Td>
            <Td>{record.light?.toString()}</Td>
            <Td>{record.temperature2?.toString()}</Td>
            <Td>{record.gyroscope?.toString()}</Td>
            <Td>{record.accelerometer?.toString()}</Td>
            <Button
              variant={'ghost'}
              borderRadius={0}
              onClick={() => {props.mint(i)}}
            >Mint</Button>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
});
