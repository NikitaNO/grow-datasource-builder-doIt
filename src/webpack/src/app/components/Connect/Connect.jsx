import React, { Component } from 'react';
import autoBind from 'react-autobind';
import styles from './styles.scss';
import { observer, inject } from 'mobx-react';
@inject('dataSourceStore')
@observer
export default class Connect extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.dataSourceStore = this.props.dataSourceStore;
  }
  handleClick(e) {
    e.preventDefault();
    this.dataSourceStore.getData();
  }
  render() {
    if (!this.dataSourceStore.selectedDataSource) {
      return <div></div>;
    }
    return (
      <div className={styles.container}>
        <button onClick={(e) => this.handleClick(e)} disabled={this.dataSourceStore.isGettingData}>Connect</button>
        {this.dataSourceStore.isGettingData &&
          <div className={styles.gettingData}>Getting Data. Please Wait ...</div>
        }
        {this.dataSourceStore.lastError &&
          <div className={styles.errorMsg}>Error: <p>{this.dataSourceStore.lastError}</p></div>
        }
      </div>
    );
  }
}