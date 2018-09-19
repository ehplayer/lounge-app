import {Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import React from 'react'
import {Actions} from 'react-native-router-flux'
import {connect} from "react-redux";
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
const bgColorMap = {
    hall: '#4581d9',
    schedule: '#535acb',
    univ: '#2b66ae',
    club: '#5b8b2b',
}

class CreateArticleNavBar extends React.Component {
  render() {
    const {boardItem} = this.props;
    const bgColor = bgColorMap[this.props.sectionType] ? bgColorMap[this.props.sectionType] : bgColorMap['univ'];

    return (
        <View style={{ backgroundColor: bgColor, flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={Actions.pop}
            style={[styles.navBarItem, { paddingLeft: 10, paddingBottom: 20, paddingTop: 20, width:40}]}>
              <Image
                  style={{width: 16, height: 16, marginLeft:10}}
                  resizeMode="contain"
                  source={ArrowLeft}/>
          </TouchableOpacity>
          <View style={[styles.navBarItem]}>
            <Text style={{fontSize: 23, color: '#ffffff'}}>{boardItem ? boardItem.name : ''}</Text>
          </View>
        </View>
    )
  }
}

const mapStateToProps = state => ({
  home: state.home || {},
  univ: state.univ || {},
  univNotice: state.univNotice || {},
  member: state.member || {},
  currentUnivId: state.currentUnivId || '전체',
});

export default connect(mapStateToProps)(CreateArticleNavBar);
