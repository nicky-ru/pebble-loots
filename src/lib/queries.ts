const getMyDpLootIds = /* Graphql */ `
  query myDpLootIds($owner: String!) {
    loots_datapoint(where: {owner: {_eq: $owner}}) {
      token_id
    }
  }
`

export {
  getMyDpLootIds
}
