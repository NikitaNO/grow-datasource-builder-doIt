import React, { Component } from 'react';
import DataSourceSelect from '../../components/DataSourceSelect';
import AuthSelect from '../../components/AuthSelect';
import FunctionSelect from '../../components/FunctionSelect';
import ReportParams from '../../components/ReportParams';
import Connect from '../../components/Connect';
import styles from './styles.scss';
export default class Aside extends Component {
  render() {
    return (
      <div className={styles.container}>
        <DataSourceSelect />
        <AuthSelect />
        <FunctionSelect />
        <ReportParams />
        <Connect />
      </div>
    );
  }
}