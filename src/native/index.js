import React from 'react';
import {SafeAreaView, Platform} from 'react-native';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import {Router} from 'react-native-router-flux';

import {Root, StyleProvider} from 'native-base';

import Routes from './routes/index';
import platform from '../../native-base-theme/variables/platform'
import getTheme from "../../native-base-theme/components";
import { PersistGate } from 'redux-persist/es/integration/react';

// Hide StatusBar on Android as it overlaps tabs
//if (Platform.OS === 'ios') StatusBar.setHidden(true);

const App = ({ store, persistor }) => (
  <Root>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StyleProvider style={getTheme(platform)}>
          <SafeAreaView style={{flex: 1, backgroundColor: '#fff', paddingTop: Platform.OS === 'android' ? 24 : 0}}>
              <Router>
                  {Routes}
              </Router>
          </SafeAreaView>
        </StyleProvider>
      </PersistGate>
    </Provider>
  </Root>
);

App.propTypes = {
  store: PropTypes.shape({}).isRequired,
  persistor: PropTypes.shape({}).isRequired,
};

export default App;
