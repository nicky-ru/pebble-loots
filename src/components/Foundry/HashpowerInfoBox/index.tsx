import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Button, Container, Stack, Text } from '@chakra-ui/react';
import { useStore } from '@/store/index';

export const HashpowerInfoBox = observer(() => {
  const { stash, dpLoot } = useStore();
  const [availablePow, setAvailablePow] = useState<number>(0);

  useEffect(() => {
    if (dpLoot.hashPow) {
      const powers = [...dpLoot.hashPow];
      const sum = powers.reduce(add, 0);
      setAvailablePow(sum);
    }
  }, [dpLoot.hashPow]);

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
          <Button>Manage</Button>
          <Button>Unstake</Button>
          <Text>APY: 520%</Text>
        </Stack>
      </Stack>
    </Box>
  );
});
