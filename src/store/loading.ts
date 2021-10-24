import { makeAutoObservable } from 'mobx';
import { BooleanState } from '@/store/standard/base';

export class LoadingStore {
  loading = new BooleanState({value: false});
  loaded = new BooleanState({value: true});

  constructor() {
    makeAutoObservable(this);
  }

  setLoading(value: boolean) {
    this.loading.setValue(value)
  }

  toggleLoading() {
    if (this.loading.value) this.loading.setValue(false);
    else this.loading.setValue(true);
  }

  setLoaded(value: boolean) {
    this.loading.setValue(value);
  }

  toggleLoaded() {
    if (this.loaded.value) this.loaded.setValue(false);
    else this.loaded.setValue(true);
  }
}
