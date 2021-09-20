import React from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Box, Heading, Wrap, WrapItem } from '@chakra-ui/react';

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
      <Wrap spacing="30px" justify="center">
        {props.tokenUris?.map(uri => (
          <WrapItem key={uri.data.name}>
            <Box w={"350px"} h={"350px"}>
              <img src={uri.data.image}/>
              {uri.data.name}
            </Box>
          </WrapItem>
        ))}
      </Wrap>
    </Container>
  );
});
