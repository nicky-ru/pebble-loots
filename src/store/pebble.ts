import { makeAutoObservable } from 'mobx';

export class PebbleStore {
  constructor() {
    makeAutoObservable(this);
  }
}
