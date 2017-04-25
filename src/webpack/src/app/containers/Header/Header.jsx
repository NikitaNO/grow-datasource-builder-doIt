import React, { Component } from 'react';
import styles from './styles.scss';
export default class Header extends Component {
  render() {
    return (
      <header className={styles.container}>
        <h1>Grow DataSource Builder</h1>
      </header>
    );
  }
}