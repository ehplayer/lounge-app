import {Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import React from 'react'
import {Actions} from 'react-native-router-flux'
import {connect} from "react-redux";
import {LinearGradient} from 'expo';
import ArrowLeft from '../../../images/arrow_left.png';

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
    const {titleColorArray} = this.props;
    return (
          <LinearGradient colors={titleColorArray || ['#394eb7','#6965dc']} style={{flexDirection: 'row'}} start={[0,0]} end={[1,0]}>
            <TouchableOpacity
              onPress={Actions.pop}
              style={[styles.navBarItem, { paddingLeft: 10, paddingBottom: 20, paddingTop: 20}]}>
              <Image
                style={{width: 16, height: 16, marginLeft:10}}
                resizeMode="contain"
                source={ArrowLeft}/>
            </TouchableOpacity>
            <View style={[styles.navBarItem]}>
              <Text style={{fontSize: 18, color: '#ffffff', paddingTop: 0}}>{this.props.title}</Text>
            </View>
          </LinearGradient>
    )
  }
}

const mapStateToProps = state => ({
  univNotice: state.univNotice || {},
  member: state.member || {},
  currentUnivId: state.currentUnivId || '전체',
});

export default connect(mapStateToProps)(TextNavBar);
