import { action, observable } from 'mobx';
import api from '../services/api';

class DataSourceStore {

  @observable dataSources;
  @observable selectedDataSource;
  @observable auths;
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
        authId: this.selectedAuth, 
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

  @action
  getAuths() {
    api.get(`/dataSources/${this.selectedDataSource}/getAuths`)
      .then(action(res => {
        this.auths = res;
      }))
      .catch(action(err => {
        this.auths = null;
      }));
  }
}

export default new DataSourceStore();