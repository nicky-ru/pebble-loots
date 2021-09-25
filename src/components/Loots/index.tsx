import React from 'react';
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
  Spinner
} from '@chakra-ui/react';
import { Link } from "react-router-dom";
import { BooleanState } from '@/store/standard/base';

interface PropsType {
  balance: number;
  tokenUris: any[];
  loading: BooleanState;
}

export const LootCards = observer((props: PropsType) => {
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
          {props.tokenUris?.map(uri => (
            <WrapItem key={uri.data.name}>
              <LinkBox as="article"  p={5} pb={10} borderWidth="1px" rounded="md">
                <Box w={"350px"} h={"350px"}>
                  <Image src={uri.data.image}/>
                  <Text my={2}>
                    <LinkOverlay as={Link} to={`/devices/${uri.data.name.toString().split("#")[1]}`}>
                      {uri.data.name}
                    </LinkOverlay>
                  </Text>
                </Box>
              </LinkBox>
            </WrapItem>
          ))}
        </Wrap>
      </Skeleton>
    </Container>
  );
});
