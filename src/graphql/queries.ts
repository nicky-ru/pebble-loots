export const getApps = /* Graphql */ `
  query app {
    applications {
      id
      version
      uri
      avatar
    }
  }
`

export const getDevices = /* Graphql */ `
  query devices {
    devices {
      id
      name
      address
      firmware
      lastDataTime
      state  # Device status, can be null if not updated
      status # Registration status, 1=pending, 2=confirmed
      name
      data
      config
      owner
    }
  }
`

export const deviceRecords = /* Graphql */ `
  query records {
    deviceRecords(where: { imei: "103381234567402" }) {
      raw # Protobuf encoded sensors values
      imei
      signature
    }
  }
`
