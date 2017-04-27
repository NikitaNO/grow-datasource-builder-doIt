import map from 'lodash/map';
import React, { Component } from 'react';
import autoBind from 'react-autobind';
import styles from './styles.scss';
import { observer, inject } from 'mobx-react';
@inject('dataSourceStore')
@observer
export default class AuthSelect extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.dataSourceStore = this.props.dataSourceStore;
  }
  handleClick(e) {
    e.preventDefault();
    let running = true;
    const dataSourceName = this.dataSourceStore.selectedDataSource;
    const child = window.open(`https://local.gogrow.com/api/data-source/auth/${dataSourceName}`, `RequestFor${dataSourceName}`, 'width=800,height=600');
    const timer = setInterval(() => {
      if (child.closed && running) {
        running = false;
        clearInterval(timer);
        this.dataSourceStore.getAuths();
      } else if (!running) {
        clearInterval(timer);
      }
    }, 500);
  }
  handleChange(e) {
    e.preventDefault();
    this.dataSourceStore.selectedAuth = e.target.value;
  }
  render() {
    if (!this.dataSourceStore.selectedDataSource) {
      return <div></div>;
    }
    const { auths } = this.dataSourceStore;
    const authList = map(auths, auth => {
      return (
        <option key={auth.id} value={auth.id}>
          {auth.name}
        </option>
      );
    });
    return (
      <div className={styles.container}>
        <select onChange={this.handleChange}>
          <option>Select Auth</option>
          {authList}
        </select>
        <button onClick={(e) => this.handleClick(e)}>New</button>
      </div>
    );
  }
}