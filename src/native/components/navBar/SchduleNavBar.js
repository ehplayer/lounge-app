import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Actions } from 'react-native-router-flux'
import Button from 'react-native-button'

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
  hall: '#4581d9',
  schedule: '#535acb',
  univ: '#2b66ae',
  club: '#5b8b2b',
}

export default class CustomNavBar extends React.Component {

  render() {
    const bgColor = bgColorMap[this.props.routeName];
    return (
      <View style={{flexDirection:'column'}}>
        <View style={{backgroundColor:bgColor, height:50, flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={Actions.pop}
            style={[styles.navBarItem, { paddingLeft: 10, paddingBottom: 1}]}>
            <Text>(</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
