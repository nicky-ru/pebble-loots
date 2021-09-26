import React from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Wrap, WrapItem, Tabs, TabList, TabPanels, Tab, TabPanel, Skeleton, Center } from '@chakra-ui/react';
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

export const Dashboard = observer(() => {
  const chartW = 750;
  const chartH = 150;

  return(
    <>
      <Tabs isFitted variant={"unstyled"}>
        <TabList>
          <Tab>Climate</Tab>
          <Tab>Motion</Tab>
          <Tab>GPS</Tab>
          <Tab>Other</Tab>
        </TabList>

        <TabPanels>

          <TabPanel>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Wrap>
                <WrapItem borderWidth={"1px"} rounded={"md"} width={"full"}>
                  <HumidityChart height={chartH} width={chartW}/>
                </WrapItem>
                <WrapItem borderWidth={"1px"} rounded={"md"} width={"full"}>
                  <PressureChart width={chartW} height={chartH}/>
                </WrapItem>
                <WrapItem borderWidth={"1px"} rounded={"md"} width={"full"}>
                  <TemperatureChart width={chartW} height={chartH}/>
                </WrapItem>
                <WrapItem borderWidth={"1px"} rounded={"md"} width={"full"}>
                  <GasChart width={chartW} height={chartH}/>
                </WrapItem>
              </Wrap>
            </ErrorBoundary>
          </TabPanel>

          <TabPanel>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Wrap>
                <WrapItem borderWidth={"1px"} rounded={"md"} width={"full"}>
                  <GyroChart width={chartW} height={chartH * 2}/>
                </WrapItem>
                <WrapItem borderWidth={"1px"} rounded={"md"} width={"full"}>
                  <AccelChart width={chartW} height={chartH * 2}/>
                </WrapItem>
              </Wrap>
            </ErrorBoundary>
          </TabPanel>

          <TabPanel>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Wrap>
                <WrapItem width={"full"}>
                  <MapBox/>
                </WrapItem>
              </Wrap>
            </ErrorBoundary>
          </TabPanel>

          <TabPanel>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Wrap>
                <WrapItem borderWidth={"1px"} rounded={"md"} width={"full"}>
                  <LightChart width={chartW} height={chartH * 1.3}/>
                </WrapItem>
                <WrapItem borderWidth={"1px"} rounded={"md"} width={"full"}>
                  <VbatChart width={chartW} height={chartH * 1.3}/>
                </WrapItem>
                <WrapItem borderWidth={"1px"} rounded={"md"} width={"full"}>
                  <SnrChart width={chartW} height={chartH * 1.3}/>
                </WrapItem>
              </Wrap>
            </ErrorBoundary>
          </TabPanel>

        </TabPanels>
      </Tabs>

    </>
  );
});
