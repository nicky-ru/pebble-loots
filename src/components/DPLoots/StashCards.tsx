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
  Text,
  Image,
  Skeleton,
  Button,
  Center
} from '@chakra-ui/react';
import { BooleanState } from '@/store/standard/base';
import { useStore } from '@/store/index';

interface PropsType {
  balance: number;
  tokenUris: any[];
  loading: BooleanState;
  loaded: BooleanState;
  withdraw: any;
}

export const StashCards = observer((props: PropsType) => {

  return(
    <Skeleton isLoaded={!props.loading.value}>

      <Wrap m={2} justify="start">
        {props.balance
          ?
          <>
            {props.tokenUris?.map(uri => (
              <WrapItem key={uri.data.name}>
                <LinkBox as="article"  p={5} pb={10} borderWidth="1px" rounded="md">
                  <Box w={"200px"} h={"200px"}>
                    <Image src={uri.data.image}/>
                    <Stack isInline justify={'end'} mt={2}>
                      <Button variant={'link'} onClick={() => {
                        props.withdraw(uri.data.name.toString().split("#")[1])
                      }}>Unstash</Button>
                    </Stack>
                  </Box>
                </LinkBox>
              </WrapItem>
            ))}
          </>
          :
          <WrapItem>
            <Center h={"200px"} flexDirection={"column"}>
              <Text>You have no stashed loots yet 😱</Text>
            </Center>
          </WrapItem>
        }
      </Wrap>

    </Skeleton>
  );
});
