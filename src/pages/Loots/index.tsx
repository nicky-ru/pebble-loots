import React, {useEffect} from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Container} from '@chakra-ui/react';
import { useStore } from '@/store/index';
import { LootCards } from '@/components/Loots';
import { TransactionResponse } from '@ethersproject/providers';
import axios from 'axios';
import { ErrorFallback } from '@/components/ErrorFallback';
import { ErrorBoundary } from 'react-error-boundary';

export const MyLoots = observer(() => {
  const { ploot } = useStore();

  const observable = useLocalObservable(() => ({
    tokenIds: [],
    chainId: 0,
    balance: 0,
    tokenUris: [],
    setChainId(newChainId: number) {
      this.chainId = newChainId;
    },
    setBalance(newBalance: Partial<TransactionResponse>) {
      // @ts-ignore
      this.balance = newBalance.toNumber();
    },
    setTokenUris(newUris) {
      this.tokenUris = newUris;
    }
  }))

  useEffect(() => {
    if (ploot.god.currentNetwork.account) {
      observable.setChainId(ploot.god.currentChain.chainId);
    }
  }, [ploot.god.currentChain.chainId]);

  useEffect(() => {
    if (observable.chainId) {
      updateBalance();
    }
  }, [observable.chainId])

  useEffect(() => {
    if (observable.balance) {
      fetchLoots();
    }
  }, [observable.balance]);

  async function fetchLoots() {
    const tokenIds = Array(observable.balance);

    for (let i = 0; i < observable.balance; i++) {
      tokenIds[i] = await ploot.contracts[observable.chainId].tokenOfOwnerByIndex({params: [ploot.god.currentNetwork.account, i]})
    }
    const tokenUris = await Promise.all(tokenIds.map(async (tid) => {
      const uri = await ploot.contracts[observable.chainId].getTokenUri({params: [tid.toNumber()]});
      return await axios.get(uri.toString());
    }))

    observable.setTokenUris(tokenUris);
  }

  async function updateBalance() {
    const balance = await ploot.contracts[observable.chainId].balanceOf({params: [ploot.god.currentNetwork.account]});
    observable.setBalance(balance);
  }

  return(
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Container maxW={'container.xl'} mt={10}>
        <LootCards
          balance={observable.balance}
          name={observable.chainId? ploot.contracts[observable.chainId].name : ""}
          symbol={observable.chainId? ploot.contracts[observable.chainId].symbol : ""}
          tokenUris={observable.tokenUris}
        />
      </Container>
    </ErrorBoundary>
  );
});
