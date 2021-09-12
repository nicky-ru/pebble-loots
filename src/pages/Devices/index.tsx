import React, { useEffect } from 'react';
import apolloClient from '../../apollo/client';
import { getDevices } from '../../graphql/queries';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { Container } from '@chakra-ui/react';
import gql from 'graphql-tag';

export const Devices = observer(() => {

  useEffect(() => {
    async function init_pebble() {
      const data = await apolloClient.query({
        query: gql(getDevices)
      })
      console.log(_.get(data, 'data.devices'));
    }

    init_pebble();
  })

  return (
    <Container maxW="md">
    </Container>
  );
});
