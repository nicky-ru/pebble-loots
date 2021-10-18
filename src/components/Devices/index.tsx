import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Heading, Skeleton } from '@chakra-ui/react';
import { useStore } from '@/store/index';
import { DevicesList } from '@/components/Devices/DevicesList';
import axios from 'axios';
import { ErrorFallback } from '@/components/ErrorFallback';
import { ErrorBoundary } from 'react-error-boundary';

export const Devices = observer(() => {
  const { pebble, god } = useStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDevices();
  }, [god.currentNetwork.account]);

  async function fetchDevices() {
    setLoading(true);
    const owner = god.currentNetwork.account;
    const url = "https://protoreader.herokuapp.com/api/my-devices/" + owner.toLowerCase();
    const axiosResponse = await axios.get(url);
    pebble.setDevices(axiosResponse.data);
    setLoading(false);
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Skeleton isLoaded={!loading}>
        <DevicesList/>
      </Skeleton>
    </ErrorBoundary>
  );
});
