import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import React from 'react'
import {Actions} from 'react-native-router-flux'
import {connect} from "react-redux";
import Icon from 'react-native-vector-icons/Entypo';
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
        <View style={{ backgroundColor: '#2867ae', flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={Actions.pop}
            style={[styles.navBarItem, { paddingLeft: 10, paddingBottom: 20, paddingTop: 20, width:40}]}>
            <Icon name="chevron-thin-left" size={25} style={{color:'#ffffff', paddingRight:10}}/>
          </TouchableOpacity>
          <View style={[styles.navBarItem]}>
            <Text style={{fontSize: 23, color: '#ffffff'}}>{boardItem ? boardItem.name : ''}</Text>
          </View>
        </View>
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
