import React, { useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useStore } from '@/store/index';
import BigNumber from 'bignumber.js';
import { ErrorFallback } from '@/components/ErrorFallback';
import { ErrorBoundary } from 'react-error-boundary';
import { MintForm } from './MintForm';

export const Minting = observer(() => {
  const { ploot } = useStore();

  const observable = useLocalObservable(() => ({
    chainId: 0,
    setChainId(newChainId: number) {
      this.chainId = newChainId;
    }
  }));

  useEffect(() => {
    if (ploot.god.currentNetwork.account) {
      observable.setChainId(ploot.god.currentChain.chainId);
    }
  }, [ploot.god.currentChain.chainId]);

  async function handleClaim(imei: string) {
    const tokenIdNum = new BigNumber(imei);
    try {
      await ploot.contracts[observable.chainId].claim({
        params: [tokenIdNum.toNumber()]
      });
    } catch (e) {
      alert(JSON.stringify(e.data.message));
    }
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <MintForm handleClaim={handleClaim} />
    </ErrorBoundary>
  );
});
