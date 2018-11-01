import React, { Component } from 'react';
import {SafeAreaView, Platform, BackHandler, DeviceEventEmitter} from 'react-native';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import {Router} from 'react-native-router-flux';

import {Root, StyleProvider} from 'native-base';

import Routes from './routes/index';
import platform from '../../native-base-theme/variables/platform'
import getTheme from "../../native-base-theme/components";
import { PersistGate } from 'redux-persist/es/integration/react';
import {Actions} from "react-native-router-flux";
// Hide StatusBar on Android as it overlaps tabs
//if (Platform.OS === 'ios') StatusBar.setHidden(true);

class App extends Component {
    static propTypes = {
        store: PropTypes.shape({}).isRequired,
        persistor: PropTypes.shape({}).isRequired,
    };
    constructor(props){
        super(props);
        this.backPressSubscriptions = new Set();
    }
    componentDidMount() {
        if (Platform.OS === 'android') {
            // there is a bug/workaround on android https://github.com/facebook/react-native/issues/3223#issuecomment-355064410
            DeviceEventEmitter.removeAllListeners('hardwareBackPress');
            DeviceEventEmitter.addListener('hardwareBackPress', () => {
                let invokeDefault = true;
                const subscriptions = [];

                this.backPressSubscriptions.forEach(sub => subscriptions.push(sub));

                for (let i = 0; i < subscriptions.reverse().length; i += 1) {
                    if (subscriptions[i]()) {
                        invokeDefault = false;
                        break;
                    }
                }

                if (invokeDefault) {
                    BackHandler.exitApp();
                }
            });

            //this.backPressSubscriptions.add(this.handleHardwareBack);
        }
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            DeviceEventEmitter.removeAllListeners('hardwareBackPress');
            this.backPressSubscriptions.clear();
        }
    }

    handleHardwareBack = () => {
        console.log(Actions.currentScene)
        if(Actions.currentScene == 'login'){

        }
        return true;
    };

    render(){
        const {store, persistor} = this.props;

        return <Root>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <StyleProvider style={getTheme(platform)}>
                        <SafeAreaView style={{flex: 1, backgroundColor: '#fff', paddingTop: Platform.OS === 'android' ? 24 : 0}}>
                            <Router backPressSubscriptions={this.backPressSubscriptions}>
                                {Routes}
                            </Router>
                        </SafeAreaView>
                    </StyleProvider>
                </PersistGate>
            </Provider>
        </Root>
    }
}
// const App = ({ store, persistor }) => (
//   <Root>
//     <Provider store={store}>
//       <PersistGate loading={null} persistor={persistor}>
//         <StyleProvider style={getTheme(platform)}>
//           <SafeAreaView style={{flex: 1, backgroundColor: '#fff', paddingTop: Platform.OS === 'android' ? 24 : 0}}>
//               <Router>
//                   {Routes}
//               </Router>
//           </SafeAreaView>
//         </StyleProvider>
//       </PersistGate>
//     </Provider>
//   </Root>
// );
//
//
// App.propTypes = {
//   store: PropTypes.shape({}).isRequired,
//   persistor: PropTypes.shape({}).isRequired,
// };

export default App;
