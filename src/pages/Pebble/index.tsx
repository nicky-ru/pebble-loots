import React from 'react';
import { observer } from 'mobx-react-lite';
import { Container } from '@chakra-ui/react';
import { useParams } from "react-router-dom";

export const Pebble = observer(() => {
  const { address }: {address: string} = useParams();

  return <Container>Here will be dashboard {address}</Container>;
});
