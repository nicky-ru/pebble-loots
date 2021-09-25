import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Heading } from '@chakra-ui/react';
import { useStore } from '@/store/index';
import { DevicesList } from '@/components/Devices/DevicesList';
import axios from 'axios';
import { ErrorFallback } from '@/components/ErrorFallback';
import { ErrorBoundary } from 'react-error-boundary';

export const Devices = observer(() => {
  const { pebble } = useStore()

  useEffect(() => {
    init_pebble();
  }, [])

  async function init_pebble() {
    const axiosResponse = await axios.get("https://protoreader.herokuapp.com/api/devices");
    pebble.setDevices(axiosResponse.data);
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Container maxW="container.lg" textAlign={'center'}>
        <Heading as={'h1'}>All devices</Heading>
        <DevicesList/>
      </Container>
    </ErrorBoundary>
  );
});
