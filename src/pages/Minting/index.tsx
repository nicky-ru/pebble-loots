import React, { useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Container, Input, Button, FormControl, FormLabel, FormHelperText } from '@chakra-ui/react';
import { useStore } from '@/store/index';

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


  return (
    <Container>
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
        <FormHelperText>You need to be the owner of the device</FormHelperText>
        <Button
          mt={4}
          onClick={() => {}}
        >
          Submit
        </Button>
      </FormControl>
    </Container>
  );
});
