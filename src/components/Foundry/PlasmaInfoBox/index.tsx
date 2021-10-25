import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Button, Container, Stack, Text } from '@chakra-ui/react';

export const PlasmaInfoBox = observer(() => {
  const [pending, setPending] = useState<number>(0);

  return(
    <Box borderWidth={'thin'} w={'45%'} p={4} borderRadius={'md'}>
      <Stack>
        <Text align={'left'}>Your pending Plasma</Text>
        <Text align={'left'}>{pending} PMT</Text>
        <Stack isInline justifyContent={'space-between'} align={'center'}>
          <Button>Collect</Button>
          <Text>10$</Text>
        </Stack>
      </Stack>
    </Box>
  );
});
