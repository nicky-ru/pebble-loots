import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/store/index';
import { LootCards } from './LootCards';
import { ErrorFallback } from '@/components/ErrorFallback';
import { ErrorBoundary } from 'react-error-boundary';

export const MyLoots = observer(() => {
  const { ploot, god, load } = useStore();

  useEffect(() => {
    fetchLoots();
  }, [ploot.god.currentNetwork.account, god.currentChain.chainId]);

  const fetchLoots = async () => {
    load.setLoading(true);
    if (god.isIotxTestnet) {
      await ploot.updateBalance();
    } else {
      ploot.setBalance(0);
    }
    await ploot.fetchLoots();
    load.setLoading(false);
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <LootCards/>
    </ErrorBoundary>
  );
});
