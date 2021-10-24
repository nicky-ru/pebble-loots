import React from 'react';
import { observer } from 'mobx-react-lite';
import { Wrap, WrapItem, Tabs, TabList, TabPanels, Tab, TabPanel, useColorModeValue } from '@chakra-ui/react';
import { VbatChart } from '@/components/Dashboard/vbat';
import { SnrChart } from '@/components/Dashboard/snr';
import { GasChart } from '@/components/Dashboard/gas';
import { TemperatureChart } from '@/components/Dashboard/temperature';
import { PressureChart } from '@/components/Dashboard/pressure';
import { HumidityChart } from '@/components/Dashboard/humidity';
import { LightChart } from '@/components/Dashboard/light';
import { GyroChart } from '@/components/Dashboard/gyro';
import { AccelChart } from '@/components/Dashboard/accel';
import { MapBox } from '../Map';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '@/components/ErrorFallback';

export const Dashboard = observer(() => {
  const chartW = 650;
  const chartH = 124;
  const borderW = '1px';
  const rounded = 'md';
  const wrapW = 'full';
  const bc = useColorModeValue('dark.400', 'dark.200');

  return (
    <>
      <Tabs isFitted variant={'unstyled'}>
        <TabList color={useColorModeValue('white', 'dark.500')}>
          <Tab>Climate</Tab>
          <Tab>Motion</Tab>
          <Tab>GPS</Tab>
          <Tab>Other</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Wrap>
                <WrapItem borderWidth={borderW} rounded={rounded} width={wrapW} borderColor={bc}>
                  <HumidityChart height={chartH} width={chartW} />
                </WrapItem>
                <WrapItem borderWidth={borderW} rounded={rounded} width={wrapW} borderColor={bc}>
                  <PressureChart width={chartW} height={chartH} />
                </WrapItem>
                <WrapItem borderWidth={borderW} rounded={rounded} width={wrapW} borderColor={bc}>
                  <TemperatureChart width={chartW} height={chartH} />
                </WrapItem>
                <WrapItem borderWidth={borderW} rounded={rounded} width={wrapW} borderColor={bc}>
                  <GasChart width={chartW} height={chartH} />
                </WrapItem>
              </Wrap>
            </ErrorBoundary>
          </TabPanel>

          <TabPanel>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Wrap>
                <WrapItem borderWidth={borderW} rounded={rounded} width={wrapW} borderColor={bc}>
                  <GyroChart width={chartW} height={chartH * 2} />
                </WrapItem>
                <WrapItem borderWidth={borderW} rounded={rounded} width={wrapW} borderColor={bc}>
                  <AccelChart width={chartW} height={chartH * 2} />
                </WrapItem>
              </Wrap>
            </ErrorBoundary>
          </TabPanel>

          <TabPanel>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Wrap>
                <WrapItem width={'full'}>
                  <MapBox />
                </WrapItem>
              </Wrap>
            </ErrorBoundary>
          </TabPanel>

          <TabPanel>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Wrap>
                <WrapItem borderWidth={borderW} rounded={rounded} width={wrapW} borderColor={bc}>
                  <LightChart width={chartW} height={chartH * 1.3} />
                </WrapItem>
                <WrapItem borderWidth={borderW} rounded={rounded} width={wrapW} borderColor={bc}>
                  <VbatChart width={chartW} height={chartH * 1.3} />
                </WrapItem>
                <WrapItem borderWidth={borderW} rounded={rounded} width={wrapW} borderColor={bc}>
                  <SnrChart width={chartW} height={chartH * 1.3} />
                </WrapItem>
              </Wrap>
            </ErrorBoundary>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
});
