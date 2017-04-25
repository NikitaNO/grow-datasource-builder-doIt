import _ from 'lodash';
import React, { Component } from 'react';
import FixedDataTable from '../../components/FixedDataTable';
import styles from './styles.scss';
export default class TableView extends Component {
  render() {
    return (
      <div className={styles.container}>
        <FixedDataTable />
      </div>
    );
  }
}