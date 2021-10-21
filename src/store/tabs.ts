import { makeAutoObservable } from 'mobx';

export class TabsStore {
  tabIndex: number = 0;

  constructor() {
    makeAutoObservable(this);
  }

  setTabIndex(index: number) {
    this.tabIndex = index;
  }
}
