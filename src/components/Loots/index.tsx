import React, { useEffect, useState } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useStore } from '@/store/index';
import { LootCards } from './LootCards';
import axios from 'axios';
import { ErrorFallback } from '@/components/ErrorFallback';
import { ErrorBoundary } from 'react-error-boundary';
import { BooleanState } from '@/store/standard/base';
import { BigNumber } from 'ethers';

const IOTX_TEST_CHAINID = 4690;

export const MyLoots = observer(() => {
  const { ploot, god } = useStore();

  const observable = useLocalObservable(() => ({
    loading: new BooleanState(),
    setLoading(newLoading: boolean) {
      this.loading.setValue(newLoading);
    }
  }));

  useEffect(() => {
    if (god.currentChain.chainId === IOTX_TEST_CHAINID) {
      updateBalance();
    }
  }, [ploot.god.currentNetwork.account, god.currentChain.chainId]);

  useEffect(() => {
    if (ploot.balance) {
      fetchLoots();
    }
  }, [ploot.balance]);

  async function fetchLoots() {
    observable.setLoading(true);
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
    observable.setLoading(false);
  }

  async function updateBalance() {
    const balance = await ploot.contracts[god.currentChain.chainId].balanceOf({ params: [ploot.god.currentNetwork.account] });
    const bal = BigNumber.from(JSON.parse(JSON.stringify(balance)).hex);
    ploot.updateBalance(bal.toNumber());
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <LootCards loading={observable.loading} />
    </ErrorBoundary>
  );
});
