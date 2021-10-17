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
  onOpen: any;
  setTokenToTransfer: any;
  approve: any;
  deposit: any;
}

export const DPCards = observer((props: PropsType) => {
  const [btnText, setBtnText] = useState("Want to mint some?");

  return(
    <Container textAlign={"center"} maxW={'full'}>
      <Text>
        Your have {props.loading.value? <Spinner size="xs" /> : props.balance}{" "}
        Datapoint Loot{props.balance === 1 ? "" : "s"}
      </Text>

      <Button mt={2} onClick={() => {props.approve()}}>
        Approve all
      </Button>

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
              <Center h={"full"} flexDirection={"column"}>
                <Text>You have no loots yet 😱</Text>
                <Link to={"/mintLoot"}>
                  <Button
                    mt={4}
                    minWidth={"200px"}
                    colorScheme="teal"
                    type="submit"
                    onMouseEnter={() => {setBtnText("Sure!")}}
                    onMouseLeave={() => {setBtnText("Want to mint some?")}}
                  >
                    {btnText}
                  </Button>
                </Link>
              </Center>
            </WrapItem>
          }
        </Wrap>

      </Skeleton>
    </Container>
  );
});
