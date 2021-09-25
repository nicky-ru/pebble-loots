import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Heading, Skeleton } from '@chakra-ui/react';
import { useStore } from '@/store/index';
import { DevicesList } from '@/components/Devices/DevicesList';
import axios from 'axios';
import { ErrorFallback } from '@/components/ErrorFallback';
import { ErrorBoundary } from 'react-error-boundary';

export const Devices = observer(() => {
  const { pebble } = useStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    init_pebble();
  }, [])

  async function init_pebble() {
    setLoading(true);
    const axiosResponse = await axios.get("https://protoreader.herokuapp.com/api/devices");
    pebble.setDevices(axiosResponse.data);
    setLoading(false);
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Container maxW="container.lg" textAlign={'center'}>
        <Heading as={'h1'}>All devices</Heading>
        <Skeleton isLoaded={!loading}><DevicesList/></Skeleton>
      </Container>
    </ErrorBoundary>
  );
});
