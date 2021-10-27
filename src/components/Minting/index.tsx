import React, { useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useStore } from '@/store/index';
import BigNumber from 'bignumber.js';
import { ErrorFallback } from '@/components/ErrorFallback';
import { ErrorBoundary } from 'react-error-boundary';
import { MintForm } from './MintForm';
import { helper } from '@/lib/helper';
import { useToast } from "@chakra-ui/react"

export const Minting = observer(() => {
  const toast = useToast();
  const { ploot, load } = useStore();

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
    load.setLoading(true)
    const tokenIdNum = new BigNumber(imei);

    const [err, res] = await helper.promise.runAsync(
      ploot.contracts[observable.chainId].claim({
        params: [tokenIdNum.toNumber()]
      })
    )

    if (err) {
      toast({
        title: "Transaction reverted.",
        description: err.data.message,
        status: 'warning',
        duration: 9000,
        isClosable: true,
      })
    } else {
      const receipt = await res.wait();
      if (receipt.status) {
        toast({
          title: "Pebble Tracker has been awaken.",
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
        toast.success('Transfer Succeeded');
        ploot.updateBalance();
      }
    }
    load.setLoading(false)
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <MintForm handleClaim={handleClaim} />
    </ErrorBoundary>
  );
});
