import React from 'react';
import { observer } from 'mobx-react-lite';
import { Container, UnorderedList, ListItem, Link, Stack, Text } from '@chakra-ui/react';
import { useStore } from '@/store/index';

export const DevicesList = observer(() => {
  const { pebble } = useStore();

  return(
    <Container maxW="container.lg" id={'devices-list'}>
      <UnorderedList>
        {pebble.devices?.map(device => (
          <ListItem listStyleType={'none'} key={device.address}>
            <Link href={`/devices/${device.address}`}>
              <Stack isInline>
                {/*<Text>Id: {device.id}</Text>*/}
                {/*<Text>Name: {device.name}</Text>*/}
                <Text>Address: {device.address}</Text>
                {/*<Text>Owner: {device.owner}</Text>*/}
              </Stack>

            </Link>
          </ListItem>
        ))}
      </UnorderedList>
    </Container>
    );
});
