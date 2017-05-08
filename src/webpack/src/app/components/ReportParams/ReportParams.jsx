import React, { Component } from 'react';
import autoBind from 'react-autobind';
import styles from './styles.scss';
import { observer, inject } from 'mobx-react';
@inject('dataSourceStore')
@observer
export default class ReportParams extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.dataSourceStore = this.props.dataSourceStore;
    this.state = {
      validJson: true
    };
  }
  handleChange(e) {
    try {
      this.dataSourceStore.reportParams = JSON.parse(e.target.value); 
      this.setState({
        validJson: true
      });
    } catch(e) {
      this.dataSourceStore.reportParams = {};
      this.setState({
        validJson: false
      });
    }
  }
  render() {
    if (!this.dataSourceStore.selectedDataSource) {
      return <div></div>;
    }
    return (
      <div className={styles.container}>
        <h4>Report Params (JSON):</h4>
        <textarea onChange={this.handleChange}></textarea>
        {!this.state.validJson && 
          <div className={styles.errorMsg}>Invalid JSON</div>
        }
      </div>
    );
  }
}