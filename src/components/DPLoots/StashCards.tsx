import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Container,
  Box,
  Heading,
  Stack,
  Wrap,
  WrapItem,
  LinkBox,
  Text,
  LinkOverlay,
  Image,
  Divider,
  Skeleton,
  Spinner, Button,
  Center
} from '@chakra-ui/react';
import { Link } from "react-router-dom";
import { BooleanState } from '@/store/standard/base';

interface PropsType {
  balance: number;
  tokenUris: any[];
  loading: BooleanState;
  loaded: BooleanState;
  withdraw: any;
}

export const StashCards = observer((props: PropsType) => {

  return(
    <Container textAlign={"center"} maxW={'full'}>
      <Text>
        Your have {props.loading.value? <Spinner size="xs" /> : props.balance}{" "}
        Stashed datapoint Loot{props.balance === 1 ? "" : "s"}
      </Text>

      <Skeleton isLoaded={!props.loading.value}>

        <Wrap mt={2} justify="center" minH={"400px"}>
          {props.balance
            ?
            <>
              {props.tokenUris?.map(uri => (
                <WrapItem key={uri.data.name}>
                  <LinkBox as="article"  p={5} pb={10} borderWidth="1px" rounded="md">
                    <Box w={"300px"} h={"300px"}>
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
              <Center h={"full"} flexDirection={"column"}>
                <Text>You have no stashed loots yet 😱</Text>
              </Center>
            </WrapItem>
          }
        </Wrap>

      </Skeleton>
    </Container>
  );
});
