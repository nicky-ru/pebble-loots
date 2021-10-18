import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Grid, GridItem,
  Box,
  Heading,
  Stack,
  Wrap,
  WrapItem,
  LinkBox,
  Image,
  Skeleton,
  Button,
  Center, Text
} from '@chakra-ui/react';
import { BooleanState } from '@/store/standard/base';
import { useStore } from '@/store/index';

interface PropsType {
  tokenUris: any[];
  loading: BooleanState;
  loaded: BooleanState;
  onOpen: any;
  setTokenToTransfer: any;
  approve: any;
  deposit: any;
}

export const DPCards = observer((props: PropsType) => {
  const { dpLoot } = useStore()

  return(
    <>
      <Grid gap={4} templateColumns="repeat(12, 1fr)">

        <GridItem colSpan={2}>
          <Center h={'full'}>
            <Stack>
              <Heading size={'md'}>
                Minted tokens
              </Heading>
              <Button m={2} onClick={() => {props.approve()}}>
                Approve all
              </Button>
            </Stack>
          </Center>
        </GridItem>

        <GridItem colSpan={10}>
          <Skeleton isLoaded={!props.loading.value}>
            <Wrap my={2} justify="start">
              {dpLoot.balance
                ?
                <>
                  {props.tokenUris?.map(uri => (
                    <WrapItem key={uri.data.name}>
                      <LinkBox as="article"  p={5} pb={10} borderWidth="1px" rounded="md">
                        <Box w={"200px"} h={"200px"}>
                          <Image src={uri.data.image}/>
                          <Stack isInline justify={'space-between'} mt={2}>
                            <Button variant={'link'} onClick={() => {
                              props.setTokenToTransfer(uri.data.name.toString().split("#")[1])
                              props.onOpen()
                            }}>Transfer</Button>
                            <Button variant={'link'} onClick={() => {
                              props.deposit(uri.data.name.toString().split("#")[1])
                            }}>Stash</Button>
                          </Stack>
                        </Box>
                      </LinkBox>
                    </WrapItem>
                  ))}
                </>
                :
                <WrapItem>
                  <Center h={"200px"} flexDirection={"column"}>
                    <Text>Empty list</Text>
                  </Center>
                </WrapItem>
              }
            </Wrap>
          </Skeleton>
        </GridItem>

      </Grid>
    </>
  );
});
