import React from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Table, Thead, Tr, Th, Td, Tbody, Box, TableCaption } from '@chakra-ui/react';
import { useStore } from '@/store/index';

export const DevicesList = observer(() => {
  const { pebble } = useStore();

  return(
    <Container maxW="container.lg" id={'devices-list'}>
      <Box>
        <Table size="sm" variant="striped">
          <TableCaption placement={"top"}>
            You can find your device here if you have registered it on IOTT portal
          </TableCaption>
          <Thead>
            <Tr>
              <Th>IMEI</Th>
              <Th>Name</Th>
              {/*<Th>Address</Th>*/}
              {/*<Th>Owner</Th>*/}
            </Tr>
          </Thead>
          <Tbody>
            {pebble.devices?.map(device => (
              <Tr key={device.id}>
                <Td>{device.id}</Td>
                <Td>{device.name}</Td>
                {/*<Td><Link as={ReactLink} to={`/devices/${device.id}`}>{device.address}</Link></Td>*/}
                {/*<Td><Link as={ReactLink} to={`/devices/${device.id}`}>{device.owner}</Link></Td>*/}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Container>
    );
});
