import { makeAutoObservable } from 'mobx';
import protobuf from 'protobufjs';
import { proto } from '@/store/standard/proto';
import BigNumber from 'bignumber.js';

let root = protobuf.parse(proto).root;

class DeviceRecord {
  imei: "103381234567402"
  raw: "0x0894b901105618e0e8fa4e20d5e2b1d20528c8c61b38bc9c0940d73a50ff2e5a04811e131a6206821ec20bea186a1031383964386463643766373635633931"
  signature: "0xe7166f3af88bb1f75d0e54c0faa64cc9274ba6ee8154ffdd5083babd135f8d1e176ad488251f7839739c126f1c45403b3be0fbdaa433fc517031d4bcf18f3a271c"
}

class DecodedRecord {
  snr: 1100;
  vbat: 162;
  latitude: BigNumber;
  longitude: BigNumber;
  gasResistance: 556300;
  temperature: 3006;
  pressure: 11915;
  humidity: 7213;
  light: 166950;
  temperature2: 3818;
  gyroscope: [6,-5,-4021];
  accelerometer: [2115,4304,4021];
  random: "323799a2aa47a007";
}

export class RecordStore {
  records = Array<DeviceRecord>();
  decodedRecords = Array<DecodedRecord>();

  constructor() {
    makeAutoObservable(this);
  }

  setRecords(records: Array<DeviceRecord>) {
    this.records = records;
  }

  decodeRecord(record: string): DecodedRecord {
    const SensorData = root.lookupType("SensorData")
    record = record.substr(2, record.length);
    const hex = Uint8Array.from(Buffer.from(record, 'hex'));
    let decoded = JSON.stringify(SensorData.decode(hex));
    let dataJson = JSON.parse(decoded);
    dataJson.latitude = new BigNumber(dataJson.latitude)
    dataJson.longitude = new BigNumber(dataJson.longitude)
    return dataJson;
  }

  setDecodedRecords() {
    this.decodedRecords = this.records.map(record => this.decodeRecord(record.raw));
  }
}
