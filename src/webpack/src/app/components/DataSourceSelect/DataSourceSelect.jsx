import map from 'lodash/map';
import autoBind from 'react-autobind';
import styles from './styles.scss';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
@inject('dataSourceStore')
@observer
export default class DataSourceSelect extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.dataSourceStore = this.props.dataSourceStore;
  }
  handleChange(e) {
    e.preventDefault();
    this.dataSourceStore.selectedDataSource = e.target.value;
  }
  render() {
    const { dataSources } = this.dataSourceStore;
    const dataSourceList = map(dataSources, dataSource => {
      return (
        <option key={dataSource} value={dataSource}>
          {dataSource}
        </option>
      );
    });
    return (
      <div className={styles.container}>
        <select onChange={this.handleChange}>
          <option>Select Datasource</option>
          {dataSourceList}
        </select>
      </div>
    );
  }
}