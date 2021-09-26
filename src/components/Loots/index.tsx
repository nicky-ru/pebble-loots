import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Container,
  Box,
  Heading,
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
}

export const LootCards = observer((props: PropsType) => {
  const [btnText, setBtnText] = useState("Want to mint some?");

  return(
    <Container textAlign={"center"} maxW={'full'}>
      <Heading mb={4}>
        Here is your collection of minted Pebble Loots
      </Heading>
      <Divider/>
      <Text>
        Your have {props.loading.value? <Spinner size="xs" /> : props.balance}{" "}
        Pebble Loot{props.balance === 1 ? "" : "s"}
      </Text>

      <Skeleton isLoaded={!props.loading.value}>

          <Wrap mt={10} justify="center" minH={"400px"}>
            {props.balance
            ?
              <>
                {props.tokenUris?.map(uri => (
                    <WrapItem key={uri.data.name}>
                      <LinkBox as="article"  p={5} pb={10} borderWidth="1px" rounded="md">
                        <Box w={"350px"} h={"400px"}>
                          <Image src={uri.data.image}/>
                          <Text my={2}>
                            <LinkOverlay as={Link} to={"/lootcharts"}>
                              {uri.data.name}
                            </LinkOverlay>
                          </Text>
                          <Button onClick={() => {
                            props.setTokenToTransfer(uri.data.name.toString().split("#")[1])
                            props.onOpen()
                          }}>Transfer</Button>
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
