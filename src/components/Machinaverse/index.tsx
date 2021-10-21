import React from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Heading, Text, Button, Box } from '@chakra-ui/react';
import { MyLoots } from '@/components/Loots';

export const Machinaverse = observer(() => {
  return (
    <Container minW={'full'} align={'center'}>
      <Heading>
        Welcome to your Machinaverse
      </Heading>
      <Text my={4}>
        Story about the machines
      </Text>
      <Button my={4}>
        Awake a new Pebble Tracker
      </Button>
      <Box borderWidth={'thin'} borderColor={'teal'} borderRadius={'3xl'} p={8} m={8}>
        <MyLoots/>
      </Box>
      <Heading>
        Vapor clouds produced
      </Heading>
      <Text my={4}>
        Your Pebble produce Vapor clouds in the Machinaverse
      </Text>
      <Button my={4}>
        Back to souls
      </Button>
      <Box borderWidth={'thin'} borderColor={'teal'} borderRadius={'3xl'} p={8} m={8}>
        <MyLoots/>
      </Box>
    </Container>
  )
});
