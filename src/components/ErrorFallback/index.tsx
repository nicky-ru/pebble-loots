import { Button, Center, Container } from '@chakra-ui/react';
import { Box, Text } from '@chakra-ui/layout';
import React from 'react';

export const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <Container role="alert">
      <Center h="500px">
        <Box>
          <p>Something went wrong:</p>
          <Text color="red.500">{error.message}</Text>
          <Button onClick={resetErrorBoundary}>Try again</Button>
        </Box>
      </Center>
    </Container>
  );
};
