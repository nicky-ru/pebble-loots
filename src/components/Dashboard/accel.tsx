import React  from 'react';
import { observer } from 'mobx-react-lite';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Container } from '@chakra-ui/react';
import { useStore } from '@/store/index';

export const AccelChart = observer(() => {
  const { rec } = useStore()
  return (
    <Container width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={rec.decodedRecords.slice(-10)}
        // margin={{
        //   top: 5,
        //   right: 30,
        //   left: 20,
        //   bottom: 5,
        // }}
      >
        {/*<CartesianGrid strokeDasharray="3 3" />*/}
        {/*<XAxis dataKey="name" />*/}
        <YAxis />
        <Tooltip />
        <Legend />
        <Line connectNulls type="monotone" dataKey="accelerometer[0]" stroke="#8884d8" activeDot={{ r: 8 }}/>
        <Line connectNulls type="monotone" dataKey="accelerometer[1]" stroke="#82ca9d"/>
        <Line connectNulls type="monotone" dataKey="accelerometer[2]" stroke="#800a9d"/>
      </LineChart>
    </Container>
  );
});