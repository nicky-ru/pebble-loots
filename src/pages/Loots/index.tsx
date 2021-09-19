import React, {useEffect} from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Container} from '@chakra-ui/react';
import { useStore } from '@/store/index';
import { LootCards } from '@/components/Loots';
import { TransactionResponse } from '@ethersproject/providers';

export const MyLoots = observer(() => {
  const { ploot } = useStore();

  const observable = useLocalObservable(() => ({
    tokenIds: [],
  }))

  useEffect(() => {
    if (ploot.god.currentNetwork.account) {
      bla();
    }
  }, [ploot.god.currentChain.chainId]);

  async function bla() {
    const chainId = ploot.god.currentChain.chainId;

  }

  return(
    <Container>
      <LootCards/>
    </Container>
  );
});
