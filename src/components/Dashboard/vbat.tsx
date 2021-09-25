import React  from 'react';
import { observer } from 'mobx-react-lite';
import { LineChart, Line, Tooltip, Legend } from 'recharts';
import { useStore } from '@/store/index';

interface PropsType {
  width: number;
  height: number;
}

export const VbatChart = observer((props: PropsType) => {
  const { rec } = useStore()
  return (
    <LineChart
      width={props.width}
      height={props.height}
      data={rec.decodedRecords.slice(-10)}
    >
      <Tooltip />
      <Legend />
      <Line connectNulls type="monotone" dataKey="vbat" stroke="#8884d8"/>
    </LineChart>
  );
});
