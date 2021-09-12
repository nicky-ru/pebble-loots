import { makeAutoObservable } from 'mobx';

class Device {
  address: "0x94ac89a5da0935bcbfade18762a8c5de75fa8ae3"
  config: null
  data: null
  firmware: ""
  id: "100000000000001"
  lastDataTime: null
  name: "100000000000001"
  owner: "0x813e92166576b7eaa50dbc985ef61c2e9da13693"
  state: null
  status: 2
}

export class PebbleStore {
  devices = Array<Device>();

  constructor() {
    makeAutoObservable(this);
  }
  setDevices(devices: Array<Device>) {
    this.devices = devices;
  }
}
