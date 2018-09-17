import {Image, Platform, StyleSheet, TouchableOpacity, View} from 'react-native'
import React from 'react'
import {Actions} from 'react-native-router-flux'
import Button from 'react-native-button'
import {LinearGradient} from 'expo';
import TopLogo from '../../../images/logo_menu.png';
import MenuButton from '../../../images/hamburger_button.png';

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
const bgColorMap = {
  hall: ['#488cdf','#3953b9'],
  home: ['#394eb7','#6965dc'],
  univ: ['#2867ae','#2867ae'],
  club: ['#549806', '#549806'],
}
export default class MenuNavBar extends React.Component {
  render() {
    const bgColor = bgColorMap[this.props.navigation.state.key];
    return (
      <View style={{flexDirection:'column'}}>
        <LinearGradient colors={bgColor}
                        style={{height:42, flexDirection: 'row'}} start={[0,0]} end={[1,0]}>
            <TouchableOpacity
              onPress={Actions.drawerOpen}
              style={{justifyContent: 'center', paddingLeft: 23, paddingBottom: 1, paddingTop:15, flex:2}}>
              <Image
                style={{width: 28, height: 20,}}
                resizeMode="contain"
                source={MenuButton}/>
            </TouchableOpacity>
            <View style={{width:'65%', paddingTop:20}}>
                <Image
                  style={{width: 104, height: 22,}}
                  resizeMode="contain"
                  source={TopLogo}/>
            </View>
        </LinearGradient>
        <LinearGradient style={[styles.container, { flexDirection: 'row', height: 56}]} colors={bgColor} start={[0,0]} end={[1,0]}>
          <View style={[styles.navBarItem, { flexDirection: 'row', justifyContent: 'flex-end'}]}>
            <TouchableOpacity
                onPress={Actions.hall}
                style={{width:'25%'}}>
              <Button onPress={Actions.hall} style={{color:this.props.navigation.state.key === 'hall' ? '#ffffff' : '#ffffff50', paddingBottom: 9, fontSize:19, fontWeight:'100'}}>Hall</Button>
              {this.props.navigation.state.key === 'hall' ? <View style={{backgroundColor: '#ffffff', width:'100%', height:4}}/> : null }
            </TouchableOpacity>
            <TouchableOpacity
                onPress={Actions.home}
                style={{width:'25%'}}>
              <Button onPress={Actions.home} style={{color:this.props.navigation.state.key === 'home' ? '#ffffff' : '#ffffff50', paddingBottom: 9, fontSize:19, fontWeight:'100'}}>Home</Button>
              {this.props.navigation.state.key === 'home' ? <View style={{backgroundColor: '#ffffff', width:'100%', height:4}}/> : null }
            </TouchableOpacity>
            <TouchableOpacity
                onPress={Actions.univ}
                style={{width:'25%'}}>
              <Button onPress={Actions.univ} style={{color:this.props.navigation.state.key === 'univ' ? '#ffffff' : '#ffffff50', paddingBottom: 9, fontSize:19, fontWeight:'100'}}>Univ.</Button>
              {this.props.navigation.state.key === 'univ' ? <View style={{backgroundColor: '#ffffff', width:'100%', height:4}}/> : null }
            </TouchableOpacity>
            <TouchableOpacity
                onPress={Actions.club}
                style={{width:'25%'}}>
              <Button onPress={Actions.club} style={{color:this.props.navigation.state.key === 'club' ? '#ffffff' : '#ffffff50', paddingBottom: 9, fontSize:19, fontWeight:'100'}}>Club</Button>
              {this.props.navigation.state.key === 'club' ? <View style={{backgroundColor: '#ffffff', width:'100%', height:4}}/> : null }
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    )
  }
}
