import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Button, Container, Stack, Text } from '@chakra-ui/react';
import { useStore } from '@/store/index';

export const HashpowerInfoBox = observer(() => {
  const { stash, dpLoot, tabs } = useStore();
  const [availablePow, setAvailablePow] = useState<number>(0);
  const [apy, setApy] = useState<string>('');

  useEffect(() => {
    if (dpLoot.hashPow) {
      const powers = [...dpLoot.hashPow];
      const sum = powers.reduce(add, 0);
      setAvailablePow(sum);
      updateAPY();
    }
  }, [dpLoot.hashPow]);

  const updateAPY = async () => {
    const _apy = await stash.calculateAPY();
    setApy(_apy.toString());
  }

  const add = (accumulator: number, a: number) => {
    return accumulator + a;
  };

  return(
    <Box borderWidth={'thin'} w={'45%'} p={4} borderRadius={'md'}>
      <Stack>
        <Text align={'left'}>Your production power</Text>
        <Text align={'left'}>
          Used {stash.userInfo?.hashPower} - Available {availablePow}
        </Text>
        <Stack isInline justifyContent={'space-between'} align={'center'}>
          <Button
            onClick={() => {
              tabs.setTabIndex(3);
            }}
          >
            Manage
          </Button>
          <Text>APY: {apy}%</Text>
        </Stack>
      </Stack>
    </Box>
  );
});
