import React, { Component } from 'react';
import Header from '../../containers/Header';
import Aside from '../../containers/Aside';
import TableView from '../../containers/TableView';
import styles from './styles.scss';
export default class App extends Component {
  render() {
    return (
      <div className={styles.app}>
        <Header />
        <div className={styles.container}>
          <Aside />
          <TableView />
        </div>
      </div>
    );
  }
}