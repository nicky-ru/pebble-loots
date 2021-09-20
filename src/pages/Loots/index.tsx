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
    chainId: 0,
    setChainId(newChainId: number) {
      this.chainId = newChainId;
    }
  }))

  useEffect(() => {
    if (ploot.god.currentNetwork.account) {
      observable.setChainId(ploot.god.currentChain.chainId);
    }
  }, [ploot.god.currentChain.chainId]);

  return(
    <Container>
      <LootCards
        bal={0}
        name={observable.chainId? ploot.contracts[observable.chainId].name : ""}
        symbol={observable.chainId? ploot.contracts[observable.chainId].symbol : ""}
      />
    </Container>
  );
});
