import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Heading, Divider } from '@chakra-ui/react';
import { useParams } from "react-router-dom";
import { useStore } from '@/store/index';
import { Dashboard } from '@/components/Dashboard';
import axios from 'axios';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '@/components/ErrorFallback';

export const Pebble = observer(() => {
  const { rec } = useStore();
  const { imei }: {imei: string} = useParams();

  useEffect(() => {
    queryRecords();
    // startInterval();
  }, []);


  const queryRecords = async () => {
    const data = await axios.get(`https://protoreader.herokuapp.com/api/devices/${imei}`);
    rec.setDecodedRecords(data.data);
  }

  const startInterval = () => {
    setInterval(() => {
      queryRecords();
    }, 10000)
  }

  return(
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Container maxW={'container.xl'}>
        <Heading my={5}>Device imei: {imei}</Heading>
        <Divider/>
        <Dashboard/>
      </Container>
    </ErrorBoundary>
  );
});
