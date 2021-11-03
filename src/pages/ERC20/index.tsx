import React from 'react';
import { observer, useLocalStore } from 'mobx-react-lite';
import {
  Container,
  FormControl,
  Input,
  Button,
  Image,
  InputGroup,
  InputRightElement,
  Flex,
  Box,
  Wrap, Heading, Stack
} from '@chakra-ui/react';
import { useStore } from '@/store/index';
import { StringState, BooleanState } from '@/store/standard/base';
import { TokenListModal } from '@/components/TokenListModal';
import { TokenState } from '@/store/lib/TokenState';
import { Icon } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { BigNumberInputState } from '@/store/standard/BigNumberInputState';
import { useEffect } from 'react';
import { Center, Text } from '@chakra-ui/layout';
import toast from 'react-hot-toast';
import { eventBus } from '@/lib/event';
import { helper } from '@/lib/helper';
import { BigNumber } from 'ethers';

export const ERC20 = observer(() => {
  const { god, token, lang, mimoRV2 } = useStore();

  const store = useLocalStore(() => ({
    amountIn: new BigNumberInputState({}),
    amountOut: new BigNumberInputState({}),
    exactIn: new BooleanState(),
    tokenIn: null as TokenState,
    tokenOut: null as TokenState,
    isOpenTokenList: new BooleanState(),
    loading: new BooleanState(),
    get state() {
      if (!god.isConnect) {
        return { valid: true, msg: lang.t('connect.wallet'), connectWallet: true };
      }
      const valid = store.tokenIn && store.tokenOut && store.amountIn.value.gt(0);
      return {
        valid,
        msg: valid ? lang.t('submit') : lang.t('invalid.input')
      };
    },
    selector: 0,
    openTokenList() {
      this.setSelector(0);
      store.isOpenTokenList.setValue(true);
    },
    openTokenList2() {
      this.setSelector(1);
      store.isOpenTokenList.setValue(true);
    },
    onSelectToken(token: TokenState) {
      if (this.selector) {
        store.tokenOut = token;
      } else {
        store.tokenIn = token;
      }
    },
    setSelector(value: number) {
      this.selector = value;
    },

    async onSubmit() {
      if (store.state.connectWallet) {
        return god.setShowConnecter(true);
      }

      store.loading.setValue(true);

      const slippage = 0.5;
      let withSlippage;
      let err, res

      if (store.tokenIn.address == '') {
        if (store.exactIn.value) {
          withSlippage = this.amountOut.value.multipliedBy(1 - slippage);
          [err, res] = await helper.promise.runAsync(mimoRV2.swapExactETHForTokens(withSlippage, this.amountIn.value, store.tokenOut.address));
        } else {
          withSlippage = this.amountIn.value.multipliedBy(1 + slippage);
          [err, res] = await helper.promise.runAsync(mimoRV2.swapETHForExactTokens(withSlippage, this.amountOut.value, store.tokenOut.address));
        }
      }
      else if (store.tokenOut.address == '') {
        if (store.exactIn.value) {
          withSlippage = this.amountOut.value.multipliedBy(1 - slippage);
          [err, res] = await helper.promise.runAsync(mimoRV2.swapExactTokensForETH(this.amountIn.value, withSlippage, store.tokenIn.address));
        } else {
          withSlippage = this.amountIn.value.multipliedBy(1 + slippage);
          [err, res] = await helper.promise.runAsync(mimoRV2.swapTokensForExactETH(this.amountOut.value, withSlippage, store.tokenIn.address));
        }
      }

      if (err) {
        toast.error(err.message);
      } else {
        const receipt = await res.wait();
        if (receipt.status) {
          toast.success('Transfer Succeeded');
        }
      }

      store.loading.setValue(false);
    }
  }));

  useEffect(() => {
    if (god.currentNetwork.account) {
      token.loadPrivateData();
    }
  }, [god.updateTicker.value]);
  useEffect(() => {
    eventBus.on('chain.switch', () => {
      store.tokenIn = null;
    });
  }, []);

  const getAmountOut = async () => {
    if (store.amountIn.format == '' || store.amountIn.format == '0') return;
    store.loading.setValue(true);

    const [err, res] = await helper.promise.runAsync(mimoRV2.getAmountsOut(store.amountIn.format, store.tokenIn.address, store.tokenOut.address));

    if (err) {
      toast.error(err.message);
    } else {
      store.amountOut.setFormat(BigNumber.from(res[1]).toString());
      console.log(res);
    }

    store.loading.setValue(false);
  }

  const getAmountIn = async () => {
    if (store.amountOut.format == '' || store.amountOut.format == '0') return;
    store.loading.setValue(true);

    const [err, res] = await helper.promise.runAsync(mimoRV2.getAmountsIn(store.amountOut.format, store.tokenIn.address, store.tokenOut.address));

    if (err) {
      toast.error(err.message);
    } else {
      store.amountIn.setFormat(BigNumber.from(res[0]).toString());
      console.log(res);
    }

    store.loading.setValue(false);
  }

  return (
    <Container maxW="md">
      <Center w={'full'} h={'70vh'}>
        <Box w={'full'} borderWidth={0} borderRadius="md" borderColor="teal" bg={'rgba(228, 249, 255, 0.9)'} boxShadow={'base'}>
          <Center h={24} borderTopRadius={'md'} boxShadow={'xs'} borderColor="grey">
            <Stack w={'full'} ml={4}>
              <Heading size={'md'} textColor={'teal.500'}>
                Exchange
              </Heading>
              <Heading size={'xs'} textColor={'teal.800'}>
                Trade tokens in an instant
              </Heading>
            </Stack>
          </Center>
          <Box my={8} mx={4}>
            <form>
              <FormControl>
                <Stack spacing={4}>
                  <Box borderRadius="md" boxShadow={'inner'} bg={'rgba(208, 217, 219, 0.9)'}>
                    <Flex justify="space-between" p={2}>
                      <Text fontSize="sm">From</Text>
                      <Text fontSize="sm">{store.tokenIn ? `Balance ${store.tokenIn.balance.format} ` : '...'}</Text>
                    </Flex>
                    <InputGroup>
                      <Input
                        border="none"
                        placeholder="0.0"
                        type="number"
                        value={store.amountIn.format}
                        onChange={(e) => {
                          store.exactIn.setValue(true)
                          store.amountIn.setFormat(e.target.value)
                          getAmountOut()
                        }} />
                      <InputRightElement onClick={store.openTokenList} width="4rem" cursor="pointer" flexDir="column">
                        {/* {store.tokenIn && <Text fontSize="sm">Balance: {store.tokenIn.balance.format}</Text>} */}
                        <Flex alignItems="center" pr={2} w="100%">
                          <Image borderRadius="full" boxSize="24px" src={store.tokenIn?.logoURI} fallbackSrc="/images/token.svg" />
                          <Icon as={ChevronDownIcon} ml={1} />
                        </Flex>
                      </InputRightElement>
                    </InputGroup>
                  </Box>

                  <Box borderRadius="md" boxShadow={'inner'} bg={'rgba(208, 217, 219, 0.9)'}>
                    <Flex justify="space-between" p={2}>
                      <Text fontSize="sm">To</Text>
                      <Text fontSize="sm">{store.tokenOut ? `Balance ${store.tokenOut.balance.format} ` : '...'}</Text>
                    </Flex>
                    <InputGroup>
                      <Input
                        border="none"
                        placeholder="0.0"
                        type="number"
                        value={store.amountOut.format}
                        onChange={(e) => {
                          store.exactIn.setValue(false)
                          store.amountOut.setFormat(e.target.value)
                          getAmountIn()
                        }} />
                      <InputRightElement onClick={store.openTokenList2} width="4rem" cursor="pointer" flexDir="column">
                        {/* {store.tokenIn && <Text fontSize="sm">Balance: {store.tokenIn.balance.format}</Text>} */}
                        <Flex alignItems="center" pr={2} w="100%">
                          <Image borderRadius="full" boxSize="24px" src={store.tokenOut?.logoURI} fallbackSrc="/images/token.svg" />
                          <Icon as={ChevronDownIcon} ml={1} />
                        </Flex>
                      </InputRightElement>
                    </InputGroup>
                  </Box>

                  <Center>
                    <Button boxShadow={'xs'} colorScheme={'teal'} type="button" mt="4" disabled={!store.state.valid || store.loading.value} onClick={store.onSubmit} isLoading={store.loading.value}>
                      {store.state.msg}
                    </Button>
                  </Center>
                </Stack>
              </FormControl>
            </form>
          </Box>
        </Box>
      </Center>
      <TokenListModal isOpen={store.isOpenTokenList.value} onClose={() => store.isOpenTokenList.setValue(false)} onSelect={store.onSelectToken} />
    </Container>
  );
});
