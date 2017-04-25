import React, { Component } from 'react';
import DataSource from '../DataSource';
import styles from './styles.scss';
export default class Aside extends Component {
  render() {
    return (
      <aside className={styles.container}>
        <DataSource />
      </aside>
    );
  }
}