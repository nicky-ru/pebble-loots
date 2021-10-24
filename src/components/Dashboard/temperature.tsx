import React from 'react';
import { observer } from 'mobx-react-lite';
import { LineChart, Line, Tooltip, Legend } from 'recharts';
import { useStore } from '@/store/index';

interface PropsType {
  width: number;
  height: number;
}

export const TemperatureChart = observer((props: PropsType) => {
  const { rec } = useStore();
  return (
    <LineChart width={props.width} height={props.height} data={rec.decodedRecords.slice(-10)}>
      <Tooltip />
      <Legend />
      <Line connectNulls type="monotone" dataKey="temperature" stroke="#8884d8" activeDot={{ r: 8 }} />
      <Line connectNulls type="monotone" dataKey="temperature2" stroke="#82ca9d" />
    </LineChart>
  );
});
