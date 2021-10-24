import React from 'react';
import { observer } from 'mobx-react-lite';
import { Table, Thead, Tr, Th, Td, Tbody, Box } from '@chakra-ui/react';
import { useStore } from '@/store/index';

export const DevicesList = observer(() => {
  const { pebble } = useStore();

  return (
    <Box>
      <Table size="sm" variant="striped">
        <Thead>
          <Tr>
            <Th>IMEI</Th>
            <Th>Name</Th>
          </Tr>
        </Thead>
        <Tbody>
          {pebble.devices.length ? (
            pebble.devices.map((device) => (
              <Tr key={device.id}>
                <Td>{device.id}</Td>
                <Td>{device.name}</Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td>You have no devices</Td>
              <Td>yet</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
});
