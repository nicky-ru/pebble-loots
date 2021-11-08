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
    const decRec = this.records.map[imei].decodedRecords;
    const dpLoot = this.rootStore.dpLoot;
    const god = this.rootStore.god;

    let hashPower;
    const snr = decRec[id].snr? decRec[id].snr.toString() : "0";
    const vbat = decRec[id].vbat? decRec[id].vbat.toString() : "0";
    const latitude = decRec[id].latitude? decRec[id].latitude.toString() : "0";
    const longitude = decRec[id].longitude? decRec[id].longitude.toString() : "0";
    const gasResistance = decRec[id].gasResistance? decRec[id].gasResistance.toString() : "0";
    const temperature = decRec[id].temperature? decRec[id].temperature.toString() : "0";
    const pressure = decRec[id].pressure? decRec[id].pressure.toString() : "0";
    const humidity = decRec[id].humidity? decRec[id].humidity.toString() : "0";
    const light = decRec[id].light? decRec[id].light.toString() : "0";
    const gyroscope = decRec[id].gyroscope? decRec[id].gyroscope.toString() : "[0,0,0]";
    const accelerometer = decRec[id].accelerometer? decRec[id].accelerometer.toString() : "[0,0,0]";
    const random = decRec[id].random? decRec[id].random.toString() : "0";

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
      this.records.map[imei].decodedRecords?.map(async (rec, i) => {
        const pow = await this.calculateHashPower(imei, i);
        console.log(pow);
        return pow;
      })
    )
    console.log(powers)
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

    return dpLoot.contracts[god.currentChain.chainId].claim({
      params: [god.currentNetwork.account, dataPoint]
    });
    // try {
    //   const tx =
    //   await tx.wait(1);
    //   this.rootStore.dpLoot.updateBalance();
    // } catch (e) {
    //   alert(JSON.stringify(e.data.message));
    // }
  }

  async addRecords(imei: string, data: any) {
    this.records.map[imei] = new RecordState({
      currentImei: imei,
      decodedRecords: this.parseRecords(data.decoded),
      encodedRecords: data.encoded,
    });
    await this.updateHashPowers(imei);
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
