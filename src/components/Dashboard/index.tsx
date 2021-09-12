import React from 'react';
import { observer } from 'mobx-react-lite';
import { Container } from '@chakra-ui/react';
import { useStore } from '@/store/index';

export const Dashboard = observer(() => {
  const { rec } = useStore()

  return(
    <Container>
      Here will be dashboard
    </Container>
  );
});
