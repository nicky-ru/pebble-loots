import React from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Wrap, WrapItem, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { VbatChart } from '@/components/Dashboard/vbat';
import { SnrChart } from '@/components/Dashboard/snr';
import { GeoChart } from '@/components/Dashboard/geo';
import { GasChart } from '@/components/Dashboard/gas';
import { TemperatureChart } from '@/components/Dashboard/temperature';
import { PressureChart } from '@/components/Dashboard/pressure';
import { HumidityChart } from '@/components/Dashboard/humidity';
import { LightChart } from '@/components/Dashboard/light';
import { GyroChart } from '@/components/Dashboard/gyro';
import { AccelChart } from '@/components/Dashboard/accel';

export const Dashboard = observer(() => {

  return(
    <Container maxW={'full'} mt={10}>
      <Tabs isFitted>
        <TabList>
          <Tab>GPS</Tab>
          <Tab>Climate</Tab>
          <Tab>Motion</Tab>
          <Tab>Other</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <GeoChart/>
          </TabPanel>

          <TabPanel>
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
          </TabPanel>

          <TabPanel>
            <Wrap mt={5} spacing="50px">

              <WrapItem>
                <GyroChart/>
              </WrapItem>

              <WrapItem>
                <AccelChart/>
              </WrapItem>

            </Wrap>
          </TabPanel>

          <TabPanel>
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
          </TabPanel>

        </TabPanels>
      </Tabs>

    </Container>
  );
});
