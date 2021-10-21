import React from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Heading, Text, Button, Box } from '@chakra-ui/react';
import { Stash } from '@/components/DPLoots/Stash';
import { useStore } from '@/store/index';

export const Foundry = observer(() => {
  const { tabs } = useStore();
  return (
    <Container minW={'full'} align={'center'}>
      <Heading>
        The Foundry
      </Heading>
      <Text my={4}>
        The Foundry is where precious Plasma is produced and collected.
      </Text>
      <Box borderWidth={'thin'} borderColor={'teal'} borderRadius={'3xl'} p={8} m={8}>
        <Stash/>
        <Button onClick={() => {tabs.setTabIndex(1)}}>
          Visit your Machinaverse
        </Button>
      </Box>
    </Container>
  )
});
