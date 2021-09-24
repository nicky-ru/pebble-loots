import React from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Link, Table, Thead, Tr, Th, Td, Tbody } from '@chakra-ui/react';
import { Link as ReactLink } from "react-router-dom";
import { useStore } from '@/store/index';

export const DevicesList = observer(() => {
  const { pebble } = useStore();

  return(
    <Container mt={10} maxW="container.lg" id={'devices-list'}>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Id</Th>
            <Th>Name</Th>
            <Th>Address</Th>
            <Th>Owner</Th>
          </Tr>
        </Thead>
        <Tbody>
          {pebble.devices?.map(device => (
            <Tr key={device.id}>
              <Td><Link as={ReactLink} to={`/devices/${device.id}`}>{device.id}</Link></Td>
              <Td><Link as={ReactLink} to={`/devices/${device.id}`}>{device.name}</Link></Td>
              <Td><Link as={ReactLink} to={`/devices/${device.id}`}>{device.address}</Link></Td>
              <Td><Link as={ReactLink} to={`/devices/${device.id}`}>{device.owner}</Link></Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
    );
});
