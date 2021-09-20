import React, { useEffect } from 'react';
import apolloClient from '../../apollo/client';
import { deviceRecords, getDevices } from '../../graphql/queries';
import gql from 'graphql-tag';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { Container, Heading, Divider } from '@chakra-ui/react';
import { useParams } from "react-router-dom";
import { useStore } from '@/store/index';
import { Dashboard } from '@/components/Dashboard';

export const Pebble = observer(() => {
  const { rec } = useStore();
  const { imei }: {imei: string} = useParams();

  useEffect(() => {
    queryRecords();
    startInterval();
  }, []);

  const queryRecords = async () => {
    const data = await apolloClient.query({
      query: gql(deviceRecords),
      variables: {imei: imei}
    })
    rec.setRecords(_.get(data, 'data.deviceRecords'))
    rec.setDecodedRecords();
  }

  const startInterval = () => {
    setInterval(() => {
      queryRecords();
    }, 5000)
  }

  return(
    <Container maxW={'container.xl'}>
      <Heading my={5}>Device imei: {imei}</Heading>
      <Divider/>
      <Dashboard/>
    </Container>
  );
});
