import React, { useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useDisclosure } from '@chakra-ui/react';
import { useStore } from '@/store/index';
import { DPCards } from '@/components/DPLoots/DPCards';
import axios from 'axios';
import { ErrorFallback } from '@/components/ErrorFallback';
import { ErrorBoundary } from 'react-error-boundary';
import { BooleanState } from '@/store/standard/base';

const IOTX_TEST_CHAINID = 4690;

export const DPLoots = observer(() => {
  const { dpLoot, god, stash } = useStore();

  const observable = useLocalObservable(() => ({
    tokenIds: [],
    tokenUris: [],
    loaded: new BooleanState(),
    loading: new BooleanState(),
    tokenToTransfer: "",
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
    }
  }))

  useEffect(() => {
    if (god.currentChain.chainId === IOTX_TEST_CHAINID) {
      dpLoot.updateBalance();
    }
  }, [dpLoot.god.currentNetwork.account, god.currentChain.chainId])

  useEffect(() => {
    if (dpLoot.balance) {
      fetchLoots();
    }
  }, [dpLoot.balance]);

  async function fetchLoots() {
    observable.setLoading(true)
    const tokenIds = Array(dpLoot.balance);

    for (let i = 0; i < dpLoot.balance; i++) {
      tokenIds[i] = await dpLoot.contracts[god.currentChain.chainId].tokenOfOwnerByIndex({params: [dpLoot.god.currentNetwork.account, i]})
    }
    const tokenUris = await Promise.all(tokenIds.map(async (tid) => {
      const uri = await dpLoot.contracts[god.currentChain.chainId].getTokenUri({params: [tid.toNumber()]});
      return await axios.get(uri.toString());
    }))

    observable.setTokenUris(tokenUris);
    observable.setLoading(false);
    observable.setLoaded(true);
  }

  async function approve() {
    try {
      await dpLoot.contracts[god.currentChain.chainId].setApprovalForAll({
        params: [stash.contracts[god.currentChain.chainId].address, true]
      });
    } catch (e) {
      alert(JSON.stringify(e.data.message))
    }
  }

  async function deposit(tokenId) {
    try {
      const tx = await stash.contracts[god.currentChain.chainId].deposit({
        params: [tokenId]
      })
      await tx.wait(1);
      dpLoot.updateBalance();
    } catch (e) {
      alert(JSON.stringify(e.data.message))
    }
  }

  return(
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <DPCards
        tokenUris={observable.tokenUris}
        loading={observable.loading}
        loaded={observable.loaded}
        setTokenToTransfer={observable.setTokenToTransfer}
        approve={approve}
        deposit={deposit}
      />
    </ErrorBoundary>
  );
});
