import {Image, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import React from 'react'
import {Actions} from 'react-native-router-flux'
import Button from 'react-native-button'
import {LinearGradient} from 'expo';
import TopLogo from '../../../images/logo_menu.png';
import MenuButton from '../../../images/hamburger_button.png';
import {connect} from "react-redux";
import loungeStyle from '../../constants/loungeStyle'
import ArrowLeft from '../../../images/arrow_left.png';

const styles = StyleSheet.create({
    container: {
        height: (Platform.OS === 'ios') ? 64 : 54,
        flexDirection: 'row',
        paddingTop: 20,
    },
    navBarItem: {
        flex: 1,
        justifyContent: 'center'
    }
})
const bgColorMap = loungeStyle.bgGradientColorMap;

class MenuNavBar extends React.Component {
    render() {
        const bgColor = bgColorMap[this.props.navigation.state.key];
        if (!this.props.member || !this.props.member.name || this.props.member.authWaiting) return <View/>

        return (
            <View style={{flexDirection: 'column'}}>
                <StatusBar backgroundColor={bgColor[0]} barStyle="dark-content" />
                <LinearGradient colors={bgColor}
                                 start={[0, 0]} end={[0, 1]}>
                    <View style={{height: 70, flexDirection: 'row'}}>
                        <TouchableOpacity
                            onPress={Actions.drawerOpen}
                            style={{justifyContent: 'center', paddingLeft: 23, paddingBottom: 1, paddingTop: 45, flex: 2}}>
                            <Image
                                style={{width: 28, height: 20,}}
                                resizeMode="contain"
                                source={MenuButton}/>
                        </TouchableOpacity>
                        <View style={{width: '65%', paddingTop: 45}}>
                            <Image
                                style={{width: 124, height: 26}}
                                resizeMode="contain"
                                source={TopLogo}/>
                        </View>
                    </View>
                    <View style={[styles.container, {flexDirection: 'row', height: 54}]}>
                        <View style={[styles.navBarItem, {flexDirection: 'row', justifyContent: 'flex-end'}]}>
                            <TouchableOpacity
                                onPress={Actions.hall}
                                style={{width: '25%'}}>
                                <Button onPress={Actions.hall} style={{
                                    color: this.props.navigation.state.key === 'hall' ? '#ffffff' : '#ffffff50',
                                    paddingBottom: 9,
                                    fontSize: 19,
                                    fontWeight: this.props.navigation.state.key === 'hall' ? 'bold' : '100'
                                }}>Union</Button>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={Actions.home}
                                style={{width: '25%'}}>
                                <Button onPress={Actions.home} style={{
                                    color: this.props.navigation.state.key === 'home' ? '#ffffff' : '#ffffff50',
                                    paddingBottom: 9,
                                    fontSize: 19,
                                    fontWeight: this.props.navigation.state.key === 'home' ? 'bold' : '100'
                                }}>Home</Button>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={Actions.univ}
                                style={{width: '25%'}}>
                                <Button onPress={Actions.univ} style={{
                                    color: this.props.navigation.state.key === 'univ' ? '#ffffff' : '#ffffff50',
                                    paddingBottom: 9,
                                    fontSize: 19,
                                    fontWeight: this.props.navigation.state.key === 'univ' ? 'bold' : '100'
                                }}>Univ.</Button>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={Actions.club}
                                style={{width: '25%'}}>
                                <Button onPress={Actions.club} style={{
                                    color: this.props.navigation.state.key === 'club' ? '#ffffff' : '#ffffff50',
                                    paddingBottom: 9,
                                    fontSize: 19,
                                    fontWeight: this.props.navigation.state.key === 'club' ? 'bold' : '100'
                                }}>Club</Button>
                            </TouchableOpacity>
                        </View>
                    </View>
                </LinearGradient>
            </View>
        )
    }
}
const mapStateToProps = state => ({
    status: state.status || {},
    member: state.member || {},
});
export default connect(mapStateToProps)(MenuNavBar);