import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Text } from '@chakra-ui/react';
import { useStore } from '@/store/index';
import { TokenState } from '@/store/lib/TokenState';

interface PropsType {
  bal: number;
  name: string;
  symbol: string;
}

export const LootCards = observer((props: PropsType) => {
  return(
    <Container>
      My balance is {props.bal} name is {props.name} symbol is {props.symbol}
    </Container>
  );
});
