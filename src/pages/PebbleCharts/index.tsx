import React, { useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Container } from '@chakra-ui/react';
import { useStore } from '@/store/index';
import axios from 'axios';
import { ErrorFallback } from '@/components/ErrorFallback';
import { ErrorBoundary } from 'react-error-boundary';
import { BooleanState } from '@/store/standard/base';
import { ChartsFrameOffChain } from '@/components/ChartsFrame/ChartsFrameOffChain';

export const PebbleCharts = observer(() => {
  const { rec, pebble, god } = useStore();

  const observable = useLocalObservable(() => ({
    loaded: new BooleanState(),
    loading: new BooleanState(),
    setLoading(newLoading: boolean) {
      this.loading.setValue(newLoading);
    },
    setLoaded(newLoaded: boolean) {
      this.loaded.setValue(newLoaded);
    }
  }))

  useEffect(() => {
    if (pebble.imei) {
      queryRecords(pebble.imei)
    }
  }, [pebble.imei])

  useEffect(() => {
    fetchDevices();
  }, [god.currentNetwork.account]);

  async function fetchDevices() {
    observable.setLoading(true);
    const owner = god.currentNetwork.account;
    const url = "https://protoreader.herokuapp.com/api/my-devices/" + owner.toLowerCase();
    const axiosResponse = await axios.get(url);
    pebble.setDevices(axiosResponse.data);
    observable.setLoading(false);
  }

  const queryRecords = async (imei: string) => {
    observable.setLoading(true);
    console.log("querying data for: ", imei);
    const data = await axios.get(`https://protoreader.herokuapp.com/api/devices/${imei}`);
    // const data = await axios.get(`http://localhost:3001/api/devices/${imei}`);
    rec.setDecodedRecords(data.data.decoded);
    console.log(data.data)
    observable.setLoading(false);
  }

  return(
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Container maxW={'container.xl'} mt={10}>
        <ChartsFrameOffChain
          loading={observable.loading}
          loaded={observable.loaded}
          queryRecords={queryRecords}
        />
      </Container>
    </ErrorBoundary>
  );
});
