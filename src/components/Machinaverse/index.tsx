import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Button, Container, Heading, Text, useDisclosure } from '@chakra-ui/react';
import { MyLoots } from '@/components/Loots';

export const Machinaverse = observer(() => {

  return (
    <Container maxW={'full'} align={'Center'}>
      <Heading>
        Welcome to your Machinaverse
      </Heading>
      <Text my={4}>
        You are the Master.
        There is enormous power in your hands.
        To make "something" be "someone".
      </Text>
      <Button my={4}>
        Awake a new Pebble Tracker
      </Button>
      <Box borderWidth={'thin'} borderColor={'teal'} borderRadius={'3xl'} p={8} m={8}>
        <MyLoots/>
      </Box>
    </Container>
  )
});
