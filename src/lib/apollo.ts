import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import crossFetch from 'cross-fetch';

const TRUSTREAM_SUBGRAPH = "http://localhost:9090/v1/graphql";

// Create the GraphQL client
const Client = new ApolloClient({
  link: createHttpLink({
    uri: TRUSTREAM_SUBGRAPH,
    fetch: crossFetch
  }),
  cache: new InMemoryCache()
});

export default Client;
