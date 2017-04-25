import { action, observable } from 'mobx';
import api from '../services/api';

class DataSourceStore {

  @observable dataSources;
  @observable selectedDataSource;
  @observable selectedAuth;
  @observable data;
  @observable isGettingData = false;
  @observable reportParams = {};
  @observable lastError;

  constructor() {
    api.get(`/dataSources`)
      .then(action(res => {
        this.dataSources = res;
      }));
  }

  @action
  getData() {
    this.isGettingData = true;
    const data = {
      params: {
        reportParams: this.reportParams
      }
    }
    api.post(`/dataSources/${this.selectedDataSource}/getData`, data)
      .then(action(res => {
        this.lastError = null;
        this.isGettingData = false;
        this.data = res.data;
      }))
      .catch(action(err => {
        this.lastError = err.body.message;
        this.isGettingData = false;
        this.data = null;
      }));
  }
}

export default new DataSourceStore();