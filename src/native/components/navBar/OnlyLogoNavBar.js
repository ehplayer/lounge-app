import {Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import React from 'react'
import {Actions} from 'react-native-router-flux'
import {connect} from "react-redux";
import {LinearGradient} from 'expo';
import {Right} from "native-base";
import TopLogo from '../../../images/logo_menu.png';
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

class CustomNavBar extends React.Component {
  render() {
    const {boardItem} = this.props;
    return (
      <LinearGradient colors={['#394eb7','#6965dc']}
                      style={{height:60, justifyContent: 'center',}} start={[0,0]} end={[1,0]}>
          <Image
            style={{width: 104, height: 22, alignSelf:'center'}}
            resizeMode="contain"
            source={TopLogo}/>
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

export default connect(mapStateToProps)(CustomNavBar);
