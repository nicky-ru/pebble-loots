import React, { useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useStore } from '@/store/index';
import { TransactionResponse } from '@ethersproject/providers';
import axios from 'axios';
import { ErrorFallback } from '@/components/ErrorFallback';
import { ErrorBoundary } from 'react-error-boundary';
import { BooleanState } from '@/store/standard/base';
import { StashCards } from '@/components/DPLoots/StashCards';

const IOTX_TEST_CHAINID = 4690;

export const Stash = observer(() => {
  const { dpLoot, god, stash } = useStore();

  const observable = useLocalObservable(() => ({
    tokenIds: [],
    chainId: 0,
    balance: 0,
    tokenUris: [],
    loaded: new BooleanState(),
    loading: new BooleanState(),
    tokenToTransfer: "",
    setChainId(newChainId: number) {
      this.chainId = newChainId;
    },
    setBalance(newBalance: number) {
      this.balance = newBalance;
    },
    setTokenUris(newUris) {
      this.tokenUris = newUris;
    },
    setLoading(newLoading: boolean) {
      this.loading.setValue(newLoading);
    },
    setLoaded(newLoaded: boolean) {
      this.loaded.setValue(newLoaded);
    },
    setTokenToTransfer(value: string) {
      this.tokenToTransfer = value;
    },
    setTokenIds(newIds: Partial<TransactionResponse>) {
      this.tokenIds = newIds;
    }
  }))

  useEffect(() => {
    if (dpLoot.god.currentNetwork.account) {
      observable.setChainId(dpLoot.god.currentChain.chainId);
    }
  }, [dpLoot.god.currentChain.chainId]);

  useEffect(() => {
    if (observable.chainId === IOTX_TEST_CHAINID) {
      updateBalance();
    }
  }, [god.currentNetwork.account])

  useEffect(() => {
    if (observable.chainId === IOTX_TEST_CHAINID) {
      updateBalance();
    }
  }, [observable.chainId])

  useEffect(() => {
    if (observable.balance) {
      fetchLoots();
    }
  }, [observable.balance]);

  async function fetchLoots() {
    observable.setLoading(true)
    console.log("bal: ",observable.balance)

    const tokenUris = await Promise.all(observable.tokenIds.map(async (tid) => {
      const uri = await dpLoot.contracts[observable.chainId].getTokenUri({params: [tid.toNumber()]});
      return await axios.get(uri.toString());
    }))

    observable.setTokenUris(tokenUris);
    observable.setLoading(false);
    observable.setLoaded(true);
  }

  async function updateBalance() {
    let ids = await stash.contracts[observable.chainId].getMyStashedTokens();
    // @ts-ignore
    observable.setBalance(ids.length);
    observable.setTokenIds(ids);
  }

  async function withdraw(tokenId) {
    try {
      const tx = await stash.contracts[god.currentChain.chainId].withdraw({
        params: [tokenId]
      })
      await tx.wait(1);
      updateBalance();
      dpLoot.updateBalance();
    } catch (e) {
      alert(JSON.stringify(e.data.message))
    }
  }

  return(
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <StashCards
        balance={observable.balance}
        tokenUris={observable.tokenUris}
        loading={observable.loading}
        loaded={observable.loaded}
        withdraw={withdraw}
      />
    </ErrorBoundary>
  );
})