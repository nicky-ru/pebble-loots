import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Stack, Text
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useStore } from '@/store/index';

interface PropsType {
  setActiveLoot: any;
  balance: number;
  onClose: any;
  isOpen: boolean;
}

export const LootDrawer = observer((props: PropsType) => {
  const { ploot } = useStore();
  const [btnText, setBtnText] = useState("Want to mint some?");

  return(
    <Drawer placement={"right"} onClose={props.onClose} isOpen={props.isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">Choose Loot to show</DrawerHeader>
        <DrawerBody>
          {props.balance
            ?
            <Stack>
              {ploot.tokenUris?.map((uri, i) => (
                <Button
                  variant={"link"}
                  key={uri.data.name}
                  onClick={() => {props.setActiveLoot(i)}}
                >
                  {uri.data.name}
                </Button>
              ))}
            </Stack>
            :
            <Center h={"100px"} flexDirection={"column"}>
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
          }
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
});
