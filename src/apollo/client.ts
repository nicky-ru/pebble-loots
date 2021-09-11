import { InMemoryCache } from '@apollo/client/cache'
import { ApolloClient, HttpLink, DefaultOptions } from '@apollo/client/core';
import fetch from 'cross-fetch';

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
}

const apolloClient = new ApolloClient({
  link: new HttpLink({
    fetch,
    uri: 'http://34.146.117.200:8000/subgraphs/name/iotex/pebble-subgraph',
  }),
  cache: new InMemoryCache(),
  defaultOptions
})

export default apolloClient
