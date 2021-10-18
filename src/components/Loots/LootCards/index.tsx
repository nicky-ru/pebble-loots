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
import { useStore } from '@/store/index';

interface PropsType {
  balance: number;
  tokenUris: any[];
  loading: BooleanState;
  loaded: BooleanState;
  onOpen: any;
  setTokenToTransfer: any;
}

export const LootCards = observer((props: PropsType) => {
  const { pebble } = useStore();
  const [btnText, setBtnText] = useState("Want to mint some?");

  return(
    <Skeleton isLoaded={!props.loading.value}>

      <Wrap p={2} justify="center">
        {props.tokenUris?.map((uri, i) => (
          <WrapItem key={i}>
            <LinkBox as="article"  p={5} pb={10} borderWidth="1px" rounded="md">
              <Box align={'right'} w={"200px"} h={"200px"}>
                <LinkOverlay onClick={() => {
                  pebble.selectImei(uri.data.name.toString().split("#")[1])
                  pebble.selectPebbleLootId(i);
                }}/>
                <Image src={uri.data.image}/>
                <Button my={2} variant={'link'} onClick={() => {
                  props.setTokenToTransfer(uri.data.name.toString().split("#")[1])
                  props.onOpen()
                }}>Transfer</Button>
              </Box>
            </LinkBox>
          </WrapItem>
        ))}
      </Wrap>

    </Skeleton>
  );
});
