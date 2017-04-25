import head from 'lodash/head';
import pullAt from 'lodash/pullAt';
import map from 'lodash/map';
import cloneDeep from 'lodash/cloneDeep';
import autoBind from 'react-autobind';
import React, { Component } from 'react';
import {Table, Column, Cell} from 'fixed-data-table-2';
import { observer, inject } from 'mobx-react';
import { reaction } from 'mobx';
@inject('dataSourceStore')
@observer
export default class FixedDataTable extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.dataSourceStore = this.props.dataSourceStore;
  }
  render() {

    const rows = this.dataSourceStore.data;

    if (!rows || rows.length === 0) {
      return (
        <div></div>
      );
    }

    const headers = head(pullAt(rows, 0));
    const columns = map(headers, (header, colIndex) => {
      return (
        <Column
          header={<Cell>{header}</Cell>}
          cell={({rowIndex, ...props}) => (
            <Cell {...props}>
              {rows[rowIndex][colIndex]}
            </Cell>
          )}
          width={150}
          flexGrow={1}
        />
      );
    });
    return (
      <div>
        <Table
          rowHeight={50}
          rowsCount={rows.length}
          width={1000}
          height={500}
          headerHeight={50}>
          {columns}
        </Table>
      </div>
    );
  }
}