import React  from 'react';
import { observer } from 'mobx-react-lite';
import { LineChart, Line, Tooltip, Legend } from 'recharts';
import { useStore } from '@/store/index';

interface PropsType {
  width: number;
  height: number;
}

export const GyroChart = observer((props: PropsType) => {
  const { rec } = useStore()
  return (
    <LineChart
      width={props.width}
      height={props.height}
      data={rec.decodedRecords.slice(-10)}
    >
      <Tooltip />
      <Legend />
      <Line connectNulls type="monotone" dataKey="gyroscope[0]" stroke="#8884d8"/>
      <Line connectNulls type="monotone" dataKey="gyroscope[1]" stroke="#82ca9d"/>
      <Line connectNulls type="monotone" dataKey="gyroscope[2]" stroke="#800a9d"/>
    </LineChart>
  );
});
