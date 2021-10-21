import React from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Heading, Text, Button, Box } from '@chakra-ui/react';
import { DPLoots } from '@/components/DPLoots';

export const Sediments = observer(() => {
  return (
    <Container minW={'full'} align={'center'}>
      <Heading>
        Your Sediments
      </Heading>
      <Text my={4}>
        Put your Sediments into the Foundry to increase the production of Plasma.
      </Text>
      <Box borderWidth={'thin'} borderColor={'teal'} borderRadius={'3xl'} p={8} m={8}>
        <DPLoots/>
      </Box>
    </Container>
  )
});
