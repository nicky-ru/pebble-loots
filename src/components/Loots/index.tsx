import React, { useEffect, useState } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useStore } from '@/store/index';
import { LootCards } from './LootCards';
import axios from 'axios';
import { ErrorFallback } from '@/components/ErrorFallback';
import { ErrorBoundary } from 'react-error-boundary';
import { BooleanState } from '@/store/standard/base';
import { BigNumber } from 'ethers';

export const MyLoots = observer(() => {
  const { ploot, god, load } = useStore();

  useEffect(() => {
    if (god.isIotxTestnet) {
      updateBalance();
    }
  }, [ploot.god.currentNetwork.account, god.currentChain.chainId]);

  useEffect(() => {
    if (ploot.balance) {
      fetchLoots();
    }
  }, [ploot.balance]);

  async function fetchLoots() {
    load.setLoading(true);
    const tokenIds = Array(ploot.balance);

    for (let i = 0; i < ploot.balance; i++) {
      tokenIds[i] = await ploot.contracts[god.currentChain.chainId].tokenOfOwnerByIndex({ params: [ploot.god.currentNetwork.account, i] });
    }
    const tokenUris = await Promise.all(
      tokenIds.map(async (tid) => {
        const uri = await ploot.contracts[god.currentChain.chainId].getTokenUri({ params: [tid.toNumber()] });
        return await axios.get(uri.toString());
      })
    );

    ploot.setTokenUris(tokenUris);
    load.setLoading(false);
  }

  async function updateBalance() {
    const balance = await ploot.contracts[god.currentChain.chainId].balanceOf({ params: [ploot.god.currentNetwork.account] });
    const bal = BigNumber.from(JSON.parse(JSON.stringify(balance)).hex);
    ploot.updateBalance(bal.toNumber());
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <LootCards/>
    </ErrorBoundary>
  );
});
