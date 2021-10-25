import { makeAutoObservable, observable } from 'mobx';
import BigNumber from 'bignumber.js';
import { RootStore } from '@/store/root';
import { utils } from 'ethers';
import { MappingState } from '@/store/standard/MappingState';
import { DecodedRecord, RecordState } from '@/store/lib/RecordState';
import axios from 'axios';

export class RecordStore {
  rootStore: RootStore;
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

  parseRecords(decrecords: Array<DecodedRecord>) {
    return decrecords.map((record) => {
      record.latitude = new BigNumber(record.latitude);
      record.longitude = new BigNumber(record.longitude);
      return record;
    });
  }

  setPowers(imei: string, powers: Array<number>) {
    this.records.map[imei].powers = [...powers];
  }

  async calculateHashPower(imei: string, id: number) {
    const decodedRecords = this.records.map[imei].decodedRecords;
    const dpLoot = this.rootStore.dpLoot;
    const god = this.rootStore.god;

    let hashPower;
    const snr = decodedRecords[id].snr.toString();
    const vbat = decodedRecords[id].vbat.toString();
    const latitude = decodedRecords[id].latitude.toString();
    const longitude = decodedRecords[id].longitude.toString();
    const gasResistance = decodedRecords[id].gasResistance.toString();
    const temperature = decodedRecords[id].temperature.toString();
    const pressure = decodedRecords[id].pressure.toString();
    const humidity = decodedRecords[id].humidity.toString();
    const light = decodedRecords[id].light.toString();
    const gyroscope = decodedRecords[id].gyroscope.toString();
    const accelerometer = decodedRecords[id].accelerometer.toString();
    const random = decodedRecords[id].random.toString();

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

  async updateHashPowers(imei: string) {
    const powers = await Promise.all(
      this.records.map[imei].decodedRecords.map(async (rec, i) => {
        return await this.calculateHashPower(imei, i);
      })
    )
    this.setPowers(imei, powers);
  }

  async mint(imei:string, id: number) {
    const decodedRecords = this.records.map[imei].decodedRecords;
    const dpLoot = this.rootStore.dpLoot;
    const god = this.rootStore.god;

    const snr = decodedRecords[id].snr.toString();
    const vbat = decodedRecords[id].vbat.toString();
    const latitude = decodedRecords[id].latitude.toString();
    const longitude = decodedRecords[id].longitude.toString();
    const gasResistance = decodedRecords[id].gasResistance.toString();
    const temperature = decodedRecords[id].temperature.toString();
    const pressure = decodedRecords[id].pressure.toString();
    const humidity = decodedRecords[id].humidity.toString();
    const light = decodedRecords[id].light.toString();
    const gyroscope = decodedRecords[id].gyroscope.toString();
    const accelerometer = decodedRecords[id].accelerometer.toString();
    const random = decodedRecords[id].random.toString();

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
    this.updateHashPowers(imei);
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
