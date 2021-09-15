import React from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Wrap, WrapItem } from '@chakra-ui/react';
import { useStore } from '@/store/index';
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
  const { rec } = useStore()

  return(
    <Container maxW={'full'} mt={10}>
      <Wrap>
        <WrapItem>
          <VbatChart/>
        </WrapItem>

        <WrapItem>
          <SnrChart/>
        </WrapItem>

        <WrapItem>
          <GeoChart/>
        </WrapItem>

        <WrapItem>
          <GasChart/>
        </WrapItem>

        <WrapItem>
          <TemperatureChart/>
        </WrapItem>

        <WrapItem>
          <PressureChart/>
        </WrapItem>

        <WrapItem>
          <HumidityChart/>
        </WrapItem>

        <WrapItem>
          <LightChart/>
        </WrapItem>

        <WrapItem>
          <GyroChart/>
        </WrapItem>

        <WrapItem>
          <AccelChart/>
        </WrapItem>

      </Wrap>
    </Container>
  );
});
