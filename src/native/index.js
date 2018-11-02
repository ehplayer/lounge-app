import React, { Component } from 'react';
import {SafeAreaView, Platform, BackHandler, DeviceEventEmitter, StyleSheet, Dimensions} from 'react-native';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import {Router} from 'react-native-router-flux';

import {Body, Button, Root, StyleProvider, Text, View} from 'native-base';

import Routes from './routes/index';
import platform from '../../native-base-theme/variables/platform'
import getTheme from "../../native-base-theme/components";
import { PersistGate } from 'redux-persist/es/integration/react';
import {Actions} from "react-native-router-flux";
import Modal from "react-native-modal";
import {LinearGradient} from "expo";
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

        this.state = {
            visibleExitModal : false,
        };
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

            this.backPressSubscriptions.add(this.handleHardwareBack);
        }
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            DeviceEventEmitter.removeAllListeners('hardwareBackPress');
            this.backPressSubscriptions.clear();
        }

    }

    handleHardwareBack = () => {
        if(Actions.currentScene === 'login'){
            this.setState({
                ...this.state,
                visibleExitModal: !this.state.visibleExitModal,
            });
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
                            <Router>
                                {Routes}
                            </Router>
                            <Modal
                                isVisible={this.state.visibleExitModal}
                                onBackdropPress={() => this.setState({visibleExitModal: false})}
                            >
                                <View style={[styles.exitModal, {height:600}]}>
                                    <Text style={{paddingTop:70, fontSize:16, fontWeight:'100'}}>앱을 종료하시겠습니까?</Text>
                                    <Body style={{alignItems: 'center', flexDirection: 'row', paddingTop: 70, paddingBottom: 40}}>
                                    <Button style={{width:120, height:50, justifyContent:'center', borderRadius:0, marginRight:5, backgroundColor:'#dddddd'}} onPress={() => this.setState({visibleExitModal: false})}>
                                        <Text>취소</Text>
                                    </Button>
                                    <Button style={{width:120, height:50, justifyContent:'center', borderRadius:0, marginLeft:5, backgroundColor: '#535acb'}} onPress={() => BackHandler.exitApp()}>
                                        <Text>확인</Text>
                                    </Button>
                                    </Body>
                                </View>
                            </Modal>
                        </SafeAreaView>
                    </StyleProvider>
                </PersistGate>
            </Provider>
        </Root>
    }
}
const styles = StyleSheet.create({
    exitModal: {
        backgroundColor: "white",
        padding: 22,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)",
        height:260
    },
});

export default App;
