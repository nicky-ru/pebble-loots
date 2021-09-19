import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Text } from '@chakra-ui/react';
import { useStore } from '@/store/index';

export const LootCards = observer(() => {
  const { god, ploot } = useStore();

  useEffect(() => {
    loadLoots();
  })

  async function loadLoots() {
    const _balance = await ploot.contract.balanceOf(god.currentNetwork.account);
    ploot.setBalance(_balance.toNumber());

    console.log("calfl", _balance);
    // const tokenUri = await lootContract.tokenURI(1);
    // const meta = await axios.get(tokenUri);
    // console.log(meta.data.image)
  }

  return(
    <Container>
      My balance is {ploot.balance}
    </Container>
  );
});
