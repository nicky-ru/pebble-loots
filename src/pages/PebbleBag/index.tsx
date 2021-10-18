import React from 'react';
import { observer, useLocalStore } from 'mobx-react-lite';
import {
  Button,
  Center,
  Container, createStandaloneToast,
  Grid,
  GridItem, Text
} from '@chakra-ui/react';
import { MyLoots } from '@/components/Loots';
import { Devices } from '@/components/Devices';
import { Minting } from '@/components/Minting';
import { LootCharts } from '@/components/LootCharts';
import { metamaskUtils } from '@/lib/metaskUtils';
import { useStore } from '@/store/index';

const toast = createStandaloneToast();
const IOTX_TEST_CHAINID = 4690;

export const PebbleBag = observer(() => {
  const { god } = useStore();

  const store = useLocalStore(() => ({
    async setChain(val) {
      const chain = god.currentNetwork.chain.map[val];
      console.log(chain);
      if (chain.networkKey !== 'eth') {
        await metamaskUtils.setupNetwork({
          chainId: chain.chainId,
          blockExplorerUrls: [chain.explorerURL],
          chainName: chain.name,
          nativeCurrency: {
            decimals: chain.Coin.decimals || 18,
            name: chain.Coin.symbol,
            symbol: chain.Coin.symbol
          },
          rpcUrls: [chain.rpcUrl]
        });
        god.setChain(val);
      } else {
        toast({ title: 'Please connect to the  Ethereum network on metamask.', position: 'top', status: 'warning' });
      }
    }
  }));

  return(
    <Container maxW={'full'}>
      {god.currentChain.chainId === IOTX_TEST_CHAINID
        ?
        <Grid
          templateColumns="repeat(6, 1fr)"
          gap={4}
          mt={10}
        >
          <GridItem rowSpan={6} colSpan={3}>
            <LootCharts/>
          </GridItem>
          <GridItem borderWidth="3px" rounded="md" rowSpan={2} colSpan={3}>
            <Devices/>
          </GridItem>
          <GridItem borderWidth="3px" rounded="md" rowSpan={2} colSpan={3}>
            <Minting/>
          </GridItem>
          <GridItem rowSpan={2} colSpan={3}>
            <MyLoots/>
          </GridItem>
        </Grid>
        :
        <Center w={"full"} flexDirection={"column"}>
          <Text>This dapp currently works only on IoTeX Testnet</Text>
          <Button colorScheme={"teal"} mt={5} onClick={() => {store.setChain(IOTX_TEST_CHAINID)}}>Switch to IoTeX Testnet</Button>
        </Center>
      }
    </Container>
  );
});
