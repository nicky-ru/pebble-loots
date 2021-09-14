import { makeAutoObservable } from 'mobx';
import protobuf from 'protobufjs'
import { proto } from '@/store/standard/proto';

let root = protobuf.parse(proto).root;

class DeviceRecord {
  imei: "103381234567402"
  raw: "0x0894b901105618e0e8fa4e20d5e2b1d20528c8c61b38bc9c0940d73a50ff2e5a04811e131a6206821ec20bea186a1031383964386463643766373635633931"
  signature: "0xe7166f3af88bb1f75d0e54c0faa64cc9274ba6ee8154ffdd5083babd135f8d1e176ad488251f7839739c126f1c45403b3be0fbdaa433fc517031d4bcf18f3a271c"
}

export class RecordStore {
  records = Array<DeviceRecord>();

  constructor() {
    makeAutoObservable(this);
  }

  setRecords(records: Array<DeviceRecord>) {
    this.records = records;
  }

  decodeRecord(record: string) {
    const SensorData = root.lookupType("SensorData")
    record = record.substr(2, record.length);
    const hex = Uint8Array.from(Buffer.from(record, 'hex'));
    let decoded = SensorData.decode(hex);
    console.log(JSON.stringify(decoded))
  }
}
