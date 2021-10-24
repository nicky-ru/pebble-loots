import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/store/index';
import { LootCards } from './LootCards';
import { ErrorFallback } from '@/components/ErrorFallback';
import { ErrorBoundary } from 'react-error-boundary';

export const MyLoots = observer(() => {
  const { ploot, god, load } = useStore();

  useEffect(() => {
    if (god.isIotxTestnet) {
      ploot.updateBalance();
    } else {
      ploot.setBalance(0);
    }
  }, [ploot.god.currentNetwork.account, god.currentChain.chainId]);

  useEffect(() => {
    load.setLoading(true);
    ploot.fetchLoots();
    load.setLoading(false);
  }, [ploot.balance]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <LootCards/>
    </ErrorBoundary>
  );
});
