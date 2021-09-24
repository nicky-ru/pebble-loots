import React, { useEffect } from 'react';
import apolloClient from '../../apollo/client';
import { deviceRecords } from '../../graphql/queries';
import gql from 'graphql-tag';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { Container, Heading, Divider } from '@chakra-ui/react';
import { useParams } from "react-router-dom";
import { useStore } from '@/store/index';
import { Dashboard } from '@/components/Dashboard';
import axios from 'axios';

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
    });
    const records = _.get(data, 'data.deviceRecords');
    const responses = await readproto(records);
    const decodedData = responses.map((res) => {// @ts-ignore
      return JSON.stringify(res.data)});

    rec.setDecodedRecords(decodedData);
  }


  const readproto = async (records) => {
    const url = import.meta.env.MODE === "development" ? "http://localhost:3001/telemetry" : "https://protoreader.herokuapp.com/telemetry";
    console.log(url);
    return await Promise.all(records.map((record) => axios.post(url, `raw=${record.raw}`)))
  }

  const startInterval = () => {
    setInterval(() => {
      queryRecords();
    }, 10000)
  }

  return(
    <Container maxW={'container.xl'}>
      <Heading my={5}>Device imei: {imei}</Heading>
      <Divider/>
      <Dashboard/>
    </Container>
  );
});
