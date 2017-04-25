import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';
import { Provider } from 'mobx-react';
import dataSourceStore from './stores/DataSourceStore';

const rootEl = document.getElementById('root');
const render = Component =>
  ReactDOM.render(
    <AppContainer>
      <Provider
        dataSourceStore={dataSourceStore}
        >
        <Component />
      </Provider>
    </AppContainer>,
    rootEl
  );

render(App);
if (module.hot) {
  module.hot.accept('./containers/App', () =>  {
    const App = require('./containers/App').default;
    render(App);
  });
}
