import React from 'react';
import { observer } from 'mobx-react-lite';
import { Grid, GridItem, Box, Heading, Stack, Wrap, WrapItem, LinkBox, Image, Skeleton, Button, Center, Text } from '@chakra-ui/react';
import { BooleanState } from '@/store/standard/base';
import { useStore } from '@/store/index';

interface PropsType {
  tokenUris: any[];
  loading: BooleanState;
  loaded: BooleanState;
  setTokenToTransfer: any;
  approve: any;
  deposit: any;
}

export const DPCards = observer((props: PropsType) => {
  const { dpLoot } = useStore();

  return (
    <Skeleton isLoaded={!props.loading.value}>
      <Wrap m={4} justify="start">
        {dpLoot.balance ? (
          <>
            {props.tokenUris?.map((uri) => (
              <WrapItem key={uri.data.name}>
                <Box w={'200px'} h={'200px'} m={4}>
                  <Image src={uri.data.image} />
                  <Button
                    variant={'outline'}
                    mt={1}
                    onClick={() => {
                      props.deposit(uri.data.name.toString().split('#')[1]);
                    }}
                  >
                    Put in the Foundry
                  </Button>
                </Box>
              </WrapItem>
            ))}
          </>
        ) : (
          <WrapItem>
            <Center h={'200px'} flexDirection={'column'}>
              <Text>Empty list</Text>
            </Center>
          </WrapItem>
        )}
      </Wrap>
    </Skeleton>
  );
});
