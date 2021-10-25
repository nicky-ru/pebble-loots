import { makeAutoObservable, observable } from 'mobx';
import BigNumber from 'bignumber.js';
import { RootStore } from '@/store/root';
import { utils } from 'ethers';
import { MappingState } from '@/store/standard/MappingState';
import { RecordState } from '@/store/lib/RecordState';
import axios from 'axios';


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
  gyroscope: [6, -5, -4021];
  accelerometer: [2115, 4304, 4021];
  random: '323799a2aa47a007';
}

export class RecordStore {
  rootStore: RootStore;
  decodedRecords = Array<DecodedRecord>();
  recordPowers = Array<number>();
  imeis = Array<string>();
  records: MappingState<RecordState> = new MappingState<RecordState>({
    currentId: '',
    map: {}
  })

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(
      this,
      {imeis: observable}
    );
  }

  setDecodedRecords(decrecords: Array<DecodedRecord>) {
    this.decodedRecords = decrecords.map((record) => {
      record.latitude = new BigNumber(record.latitude);
      record.longitude = new BigNumber(record.longitude);
      return record;
    });
  }

  parseRecords(decrecords: Array<DecodedRecord>) {
    return decrecords.map((record) => {
      record.latitude = new BigNumber(record.latitude);
      record.longitude = new BigNumber(record.longitude);
      return record;
    });
  }

  setPowers(powers: Array<number>) {
    this.recordPowers = [...powers];
  }

  async calculateHashPower(id: number) {
    const rec = this.rootStore.rec;
    const dpLoot = this.rootStore.dpLoot;
    const god = this.rootStore.god;

    let hashPower;
    const snr = rec.decodedRecords[id].snr.toString();
    const vbat = rec.decodedRecords[id].vbat.toString();
    const latitude = rec.decodedRecords[id].latitude.toString();
    const longitude = rec.decodedRecords[id].longitude.toString();
    const gasResistance = rec.decodedRecords[id].gasResistance.toString();
    const temperature = rec.decodedRecords[id].temperature.toString();
    const pressure = rec.decodedRecords[id].pressure.toString();
    const humidity = rec.decodedRecords[id].humidity.toString();
    const light = rec.decodedRecords[id].light.toString();
    const gyroscope = rec.decodedRecords[id].gyroscope.toString();
    const accelerometer = rec.decodedRecords[id].accelerometer.toString();
    const random = rec.decodedRecords[id].random.toString();

    const dataPoint = [snr, vbat, latitude, longitude, gasResistance, temperature, pressure, humidity, light, gyroscope, accelerometer, random];

    try {
      hashPower = await dpLoot.contracts[god.currentChain.chainId].calculateHashPower({
        params: [dataPoint]
      });
    } catch (e) {
      alert(JSON.stringify(e.data.message));
    }

    return hashPower;
  }

  async mint(id: number) {
    const rec = this.rootStore.rec;
    const dpLoot = this.rootStore.dpLoot;
    const god = this.rootStore.god;

    const snr = rec.decodedRecords[id].snr.toString();
    const vbat = rec.decodedRecords[id].vbat.toString();
    const latitude = rec.decodedRecords[id].latitude.toString();
    const longitude = rec.decodedRecords[id].longitude.toString();
    const gasResistance = rec.decodedRecords[id].gasResistance.toString();
    const temperature = rec.decodedRecords[id].temperature.toString();
    const pressure = rec.decodedRecords[id].pressure.toString();
    const humidity = rec.decodedRecords[id].humidity.toString();
    const light = rec.decodedRecords[id].light.toString();
    const gyroscope = rec.decodedRecords[id].gyroscope.toString();
    const accelerometer = rec.decodedRecords[id].accelerometer.toString();
    const random = rec.decodedRecords[id].random.toString();

    const dataPoint = [snr, vbat, latitude, longitude, gasResistance, temperature, pressure, humidity, light, gyroscope, accelerometer, random];

    console.log('Minting dp', dataPoint);

    try {
      await dpLoot.contracts[god.currentChain.chainId].claim({
        params: [god.currentNetwork.account, dataPoint]
      });
    } catch (e) {
      alert(JSON.stringify(e.data.message));
    }
  }

  addRecords(imei: string, data: any) {
    this.records.map[imei] = new RecordState({
      currentImei: imei,
      decodedRecords: this.parseRecords(data.decoded),
      encodedRecords: data.encoded,
    });
  }

  addImei(imei: string) {
    if (this.imeis.indexOf(imei) < 0) {
      this.setImeis([...this.imeis, ...[imei]]);
    }
  }

  setImeis(imeis: Array<string>) {
    this.imeis = [...imeis];
  }

  async queryRecords(imei: string) {
    console.log('querying data for: ', imei);
    const data = await axios.get(`https://protoreader.herokuapp.com/api/devices/${imei}`);
    this.addRecords(imei, data.data);
  };
}
