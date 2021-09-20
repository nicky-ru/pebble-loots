import React, { useEffect } from 'react';
import apolloClient from '../../apollo/client';
import { getDevices } from '../../graphql/queries';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { Container, Heading } from '@chakra-ui/react';
import gql from 'graphql-tag';
import { useStore } from '@/store/index';
import { DevicesList } from '@/components/Devices/DevicesList';

export const Devices = observer(() => {
  const { pebble } = useStore()

  useEffect(() => {
    init_pebble();
  }, [])

  async function init_pebble() {
    const data = await apolloClient.query({
      query: gql(getDevices)
    })
    pebble.setDevices(_.get(data, 'data.devices'));
  }

  return (
    <Container maxW="container.lg" textAlign={'center'}>
      <Heading as={'h1'}>All devices</Heading>
      <DevicesList/>
    </Container>
  );
});
