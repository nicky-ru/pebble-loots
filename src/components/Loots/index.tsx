import React from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Box, Heading, Wrap, WrapItem, LinkBox, Text, LinkOverlay, Image } from '@chakra-ui/react';
import { Link } from "react-router-dom";

interface PropsType {
  balance: number;
  name: string;
  symbol: string;
  tokenUris: any[];
}

export const LootCards = observer((props: PropsType) => {
  return(
    <Container textAlign={"center"} maxW={'full'}>
      <Heading mb={4}>
        My balance is {props.balance} name is {props.name} symbol is {props.symbol}
      </Heading>
      <Wrap justify="center">
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
    </Container>
  );
});
