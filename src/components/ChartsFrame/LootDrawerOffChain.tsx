import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Stack
} from '@chakra-ui/react';
import { useStore } from '@/store/index';

interface PropsType {
  onClose: any;
  isOpen: boolean;
}

export const LootDrawerOffChain = observer((props: PropsType) => {
  const { pebble } = useStore();

  return(
    <Drawer placement={"right"} onClose={props.onClose} isOpen={props.isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">Choose Loot to show</DrawerHeader>
        <DrawerBody>
          <Stack>
            {pebble.devices?.map((device, i) => (
              <Button
                variant={"link"}
                key={device.address}
                onClick={() => {pebble.selectImei(device.id)}}
              >
                {device.name}
              </Button>
            ))}
          </Stack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
});
