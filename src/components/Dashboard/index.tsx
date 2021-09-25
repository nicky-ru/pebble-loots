import React from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Wrap, WrapItem, Tabs, TabList, TabPanels, Tab, TabPanel, Skeleton } from '@chakra-ui/react';
import { VbatChart } from '@/components/Dashboard/vbat';
import { SnrChart } from '@/components/Dashboard/snr';
import { GasChart } from '@/components/Dashboard/gas';
import { TemperatureChart } from '@/components/Dashboard/temperature';
import { PressureChart } from '@/components/Dashboard/pressure';
import { HumidityChart } from '@/components/Dashboard/humidity';
import { LightChart } from '@/components/Dashboard/light';
import { GyroChart } from '@/components/Dashboard/gyro';
import { AccelChart } from '@/components/Dashboard/accel';
import { MapBox } from "../Map";
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '@/components/ErrorFallback';
import { BooleanState } from '@/store/standard/base';

interface PropsType {
  loading: BooleanState;
}

export const Dashboard = observer((props: PropsType) => {

  return(
    <Container maxW={'full'} mt={10}>
      <Tabs isFitted>
        <TabList>
          <Tab>Climate</Tab>
          <Tab>Motion</Tab>
          <Tab>GPS</Tab>
          <Tab>Other</Tab>
        </TabList>

        <TabPanels>

          <TabPanel>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Skeleton isLoaded={!props.loading.value}>
                <Wrap mt={5} spacing="50px">
                  <WrapItem>
                    <HumidityChart/>
                  </WrapItem>
                  <WrapItem>
                    <PressureChart/>
                  </WrapItem>
                  <WrapItem>
                    <TemperatureChart/>
                  </WrapItem>
                  <WrapItem>
                    <GasChart/>
                  </WrapItem>
                </Wrap>
              </Skeleton>
            </ErrorBoundary>
          </TabPanel>

          <TabPanel>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Skeleton isLoaded={!props.loading.value}>
                <Wrap mt={5} spacing="50px">
                  <WrapItem>
                    <GyroChart/>
                  </WrapItem>
                  <WrapItem>
                    <AccelChart/>
                  </WrapItem>
                </Wrap>
              </Skeleton>
            </ErrorBoundary>
          </TabPanel>

          <TabPanel>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Skeleton isLoaded={!props.loading.value}>
                <Wrap>
                  <WrapItem>
                    <MapBox/>
                  </WrapItem>
                </Wrap>
              </Skeleton>
            </ErrorBoundary>
          </TabPanel>

          <TabPanel>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Skeleton isLoaded={!props.loading.value}>
                <Wrap mt={5} spacing="50px" justify="center">
                  <WrapItem>
                    <LightChart/>
                  </WrapItem>
                  <WrapItem>
                    <VbatChart/>
                  </WrapItem>
                  <WrapItem>
                    <SnrChart/>
                  </WrapItem>
                </Wrap>
              </Skeleton>
            </ErrorBoundary>
          </TabPanel>

        </TabPanels>
      </Tabs>

    </Container>
  );
});
