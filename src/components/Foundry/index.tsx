import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Heading, Text, Button, Box, Stack } from '@chakra-ui/react';
import { useStore } from '@/store/index';

export const Foundry = observer(() => {
  const { tabs, dpLoot, stash } = useStore();
  const [availablePow, setAvailablePow] = useState<number>(0);

  useEffect(() => {
    if (dpLoot.hashPow) {
      const powers = [...dpLoot.hashPow];
      const sum = powers.reduce(add,0);
      setAvailablePow(sum);
      stash.updateUserInfo();
    }
  }, [dpLoot.hashPow]);

  const add = (accumulator: number, a: number) => {
    return accumulator + a;
  }

  return (
    <Container minW={'full'} align={'center'}>
      <Heading>
        The Foundry
      </Heading>
      <Text my={4}>
        The Foundry is where precious Plasma is produced and collected.
      </Text>
      <Box borderWidth={'thin'} borderColor={'teal'} borderRadius={'3xl'} p={8} m={8}>
        <Stack isInline w={'full'} justifyContent={'space-between'}>
          <Box borderWidth={'thin'} w={'45%'} p={4} borderRadius={'md'}>
            <Stack>
              <Text align={'left'}>Your pending Plasma</Text>
              <Text align={'left'}>100 PMT</Text>
              <Stack isInline justifyContent={'space-between'} align={'center'}>
                <Button>Collect</Button>
                <Text>10$</Text>
              </Stack>
            </Stack>
          </Box>
          <Box borderWidth={'thin'} w={'45%'} p={4} borderRadius={'md'}>
            <Stack>
              <Text align={'left'}>Your production power</Text>
              <Text align={'left'}>Used {stash.userInfo?.hashPower} - Available {availablePow}</Text>
              <Stack isInline justifyContent={'space-between'} align={'center'}>
                <Button>Manage</Button>
                <Text>APY: 520%</Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
        <Button mt={8} onClick={() => {tabs.setTabIndex(1)}}>
          Visit your Machinaverse
        </Button>
      </Box>
    </Container>
  )
});
