import {Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import React from 'react'
import {Actions} from 'react-native-router-flux'
import {connect} from "react-redux";
import {LinearGradient} from 'expo';
import {Button, Right} from "native-base";
import leftArrow from '../../../images/arrow_left.png'
import search from '../../../images/search.png'

const styles = StyleSheet.create({
  container: {
    height: (Platform.OS === 'ios') ? 64 : 54,
    flexDirection: 'row',
    paddingTop: 20,
  },
  navBarItem: {
    paddingLeft: 20,
    justifyContent: 'center',

  }
})

class TextNavBar extends React.Component {
  render() {
    return (
          <LinearGradient colors={['#394eb7','#6965dc']} style={{flexDirection: 'row'}} start={[0,0]} end={[1,0]}>
            <TouchableOpacity
              onPress={Actions.pop}
              style={{justifyContent: 'center', paddingLeft: 10, paddingBottom: 20, paddingTop: 40}}>
              <Image
                style={{width: 15, height: 25}}
                resizeMode="contain"
                source={leftArrow}
              />
            </TouchableOpacity>
            <View style={[styles.navBarItem, {width:'78%'}]}>
              <Text style={{fontSize: 20, color: '#ffffff', paddingTop: 22}}>{this.props.title}</Text>
            </View>
            <TouchableOpacity
              onPress={Actions.schedulerSearch}
              style={{justifyContent: 'center',paddingLeft: 10, paddingBottom: 20, paddingTop: 40}}>
              <Right>
                <Image
                  style={{width: 25, height: 25}}
                  resizeMode="contain"
                  source={search}
                />
              </Right>
            </TouchableOpacity>
          </LinearGradient>
    )
  }
}

const mapStateToProps = state => ({
  recipes: state.recipes || {},
  univNotice: state.univNotice || {},
  member: state.member || {},
  currentUnivId: state.currentUnivId || '전체',
});

export default connect(mapStateToProps)(TextNavBar);
