import map from 'lodash/map';
import React, { Component } from 'react';
import autoBind from 'react-autobind';
import styles from './styles.scss';
import { observer, inject } from 'mobx-react';
@inject('dataSourceStore')
@observer
export default class FunctionSelect extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.dataSourceStore = this.props.dataSourceStore;
  }
  handleChange(e) {
    e.preventDefault();
    this.dataSourceStore.selectedFunction = e.target.value;
  }
  render() {
    if (!this.dataSourceStore.selectedDataSource) {
      return <div></div>;
    }
    const { functionList } = this.dataSourceStore;
    const functionListOptions = map(functionList, func => {
      return (
        <option key={func} value={func}>
          {func}
        </option>
      );
    });
    return (
      <div className={styles.container}>
        <select onChange={this.handleChange}>
          <option>getData</option>
          {functionListOptions}
        </select>
      </div>
    );
  }
}