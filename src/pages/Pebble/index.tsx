import React, { useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Container, Heading, Divider } from '@chakra-ui/react';
import { useParams } from "react-router-dom";
import { useStore } from '@/store/index';
import { Dashboard } from '@/components/Dashboard';
import axios from 'axios';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '@/components/ErrorFallback';
import { BooleanState } from '@/store/standard/base';
import { TransactionResponse } from '@ethersproject/providers';

export const Pebble = observer(() => {
  const { rec } = useStore();
  const { imei }: {imei: string} = useParams();

  const observable = useLocalObservable(() => ({
    loading: new BooleanState(),
    setLoading(newLoading: boolean) {
      this.loading.setValue(newLoading);
    }
  }))

  useEffect(() => {
    queryRecords();
    // startInterval();
  }, []);


  const queryRecords = async () => {
    observable.setLoading(true);
    const data = await axios.get(`https://protoreader.herokuapp.com/api/devices/${imei}`);
    rec.setDecodedRecords(data.data);
    observable.setLoading(false);
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
        <Dashboard loading={observable.loading}/>
      </Container>
    </ErrorBoundary>
  );
});
