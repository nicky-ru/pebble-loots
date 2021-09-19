import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { ethers } from 'ethers'
import { Container} from '@chakra-ui/react';
import { useStore } from '@/store/index';
import { LootCards } from '@/components/Loots';
import axios from 'axios';

export const MyLoots = observer(() => {
  const { god, ploot } = useStore();

  useEffect(() => {
    ploot.init(god.currentChain.rpcUrl);
  }, []);

  return(
    <Container>
      <LootCards/>
    </Container>
  );
});
