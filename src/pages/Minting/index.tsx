import React, { useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Container, Input, Button, FormControl, FormLabel, FormHelperText, Heading } from '@chakra-ui/react';
import { useStore } from '@/store/index';
import BigNumber from 'bignumber.js';
import { ErrorFallback } from '@/components/ErrorFallback';
import { ErrorBoundary } from 'react-error-boundary';

export const Minting = observer(() => {
  const { ploot } = useStore();

  const observable = useLocalObservable(() => ({
    chainId: 0,
    tokenId: "",
    setChainId(newChainId: number) {
      this.chainId = newChainId;
    },
    setTokenId(newTokenId: string) {
      this.tokenId = newTokenId;
    }
  }))

  useEffect(() => {
    if (ploot.god.currentNetwork.account) {
      observable.setChainId(ploot.god.currentChain.chainId);
    }
  }, [ploot.god.currentChain.chainId]);

  async function handleClaim() {
    const tokenIdNum = new BigNumber(observable.tokenId);
    await ploot.contracts[observable.chainId].claim({
      params: [tokenIdNum.toNumber()]
    })
    observable.setTokenId("");
  }


  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Container textAlign={"center"} maxW={'container.lg'} mt={10}>
        <Heading>Here you can mint a Loot of your device</Heading>
        <FormControl id="deviceId">
          <FormLabel>Device id to mint</FormLabel>
          <Input
            type={'text'}
            placeholder={'Input your device id/imei'}
            value={observable.tokenId}
            onChange={(e) => {
              observable.setTokenId(e.target.value);
            }}
          />
          <FormHelperText>You need to be an owner of the device</FormHelperText>
          <Button
            mt={4}
            onClick={() => {handleClaim()}}
          >
            Submit
          </Button>
        </FormControl>
      </Container>
    </ErrorBoundary>
  );
});
