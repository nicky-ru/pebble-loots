import React, { useEffect } from 'react';
import apolloClient from '../../apollo/client';
import { getDevices } from '../../graphql/queries';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { Container, Text } from '@chakra-ui/react';
import gql from 'graphql-tag';
import { useStore } from '@/store/index';
import { DevicesList } from '@/components/Devices/DevicesList';

export const Devices = observer(() => {
  const { pebble } = useStore()

  useEffect(() => {
    async function init_pebble() {
      const data = await apolloClient.query({
        query: gql(getDevices)
      })
      pebble.setDevices(_.get(data, 'data.devices'));
    }
    init_pebble();
  }, [])

  return (
    <Container maxW="container.lg">
      <DevicesList/>
    </Container>
  );
});
