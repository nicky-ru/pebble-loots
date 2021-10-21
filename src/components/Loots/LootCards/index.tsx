import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Wrap,
  WrapItem,
  LinkBox,
  LinkOverlay,
  Image,
  Skeleton
} from '@chakra-ui/react';
import { BooleanState } from '@/store/standard/base';
import { useStore } from '@/store/index';

interface PropsType {
  loading: BooleanState;
}

export const LootCards = observer((props: PropsType) => {
  const { pebble, ploot } = useStore();

  return(
    <Skeleton isLoaded={!props.loading.value}>

      <Wrap p={2} justify="center">
        {ploot.tokenUris?.map((uri, i) => (
          <WrapItem key={i}>
            <LinkBox as="article"  p={5} pb={10} borderWidth="1px" rounded="md">
              <Box align={'right'} w={"200px"} h={"200px"}>
                <LinkOverlay onClick={() => {
                  pebble.selectImei(uri.data.name.toString().split("#")[1])
                  pebble.selectPebbleLootId(i);
                }}/>
                <Image src={uri.data.image}/>
              </Box>
            </LinkBox>
          </WrapItem>
        ))}
      </Wrap>

    </Skeleton>
  );
});
