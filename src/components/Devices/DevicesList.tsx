import React from 'react';
import { observer } from 'mobx-react-lite';
import { Container, UnorderedList, ListItem } from '@chakra-ui/react';
import { useStore } from '@/store/index';

export const DevicesList = observer(() => {
  const { pebble } = useStore();

  return(
    <Container maxW="container.lg">
      <UnorderedList>
        {pebble.devices?.map(device => (
          <ListItem key={device.address}>{device.address}</ListItem>
        ))}
      </UnorderedList>
    </Container>
    );
});
