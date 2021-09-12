import React, { useEffect } from 'react';
import apolloClient from '../../apollo/client';
import { deviceRecords, getDevices } from '../../graphql/queries';
import gql from 'graphql-tag';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { Container, Heading } from '@chakra-ui/react';
import { useParams } from "react-router-dom";
import { useStore } from '@/store/index';
import { Dashboard } from '@/components/Dashboard';

export const Pebble = observer(() => {
  const { pebble, rec } = useStore();
  const { address }: {address: string} = useParams();

  useEffect(() => {
    async function getDeviceRecords() {
      const devices = await apolloClient.query({
        query: gql(getDevices)
      })
      pebble.setDevices(_.get(devices, 'data.devices'));

      const imei = pebble.deviceByImei(address).id;

      const data = await apolloClient.query({
        query: gql(deviceRecords),
        variables: {imei: imei}
      })
      rec.setRecords(_.get(data, 'data.deviceRecords'))
    }

    getDeviceRecords();
  }, [])

  return(
    <Container>
      <Heading>Device address: {address}</Heading>
      <Dashboard/>
    </Container>
  );
});
