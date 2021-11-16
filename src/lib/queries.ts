const getMyDpLootIds = /* Graphql */ `
  query myDpLootIds($owner: String!) {
    loots_datapoint(where: {owner: {_eq: $owner}}) {
      token_id
    }
  }
`

const getMyUnstakedDpLoots = /* Graphql */ `
query myUnstakedDpLoots($owner: String!) {
  loots_datapoint(where: {owner: {_eq: $owner}, is_staked: {_eq: false}}) {
    token_id
  }
}
`

const getMyStakedDpLoots = /* Graphql */ `
query myUnstakedDpLoots($owner: String!) {
  loots_datapoint(where: {owner: {_eq: $owner}, is_staked: {_eq: true}}) {
    token_id
    dig_power
  }
}
`

export {
  getMyDpLootIds,
  getMyUnstakedDpLoots,
  getMyStakedDpLoots
}
