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
    justifyContent: 'center',

  }
})
const bgColorMap = {
    hall: '#4581d9',
    home: '#535acb',
    univ: '#2b66ae',
    club: '#5b8b2b',
}

class CreateArticleNavBar extends React.Component {
  render() {
    const {boardItem, title, needBackButtonText} = this.props;
    const sectionType = this.props.sectionType || this.props.param.sectionType;
    const bgColor = bgColorMap[sectionType] ? bgColorMap[sectionType] : bgColorMap['univ'];
    return (
        <View style={{ backgroundColor: bgColor, flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={Actions.pop}
            style={[styles.navBarItem, { paddingLeft: 10, paddingBottom: 20, paddingTop: 20, width:60}]}>
              {needBackButtonText ?
                  <Text style={{width: 40, fontSize:20, marginLeft: 10, color:'#ffffff'}}>{needBackButtonText}</Text>
                  :<Image
                      style={{width: 16, height: 16, marginLeft: 10}}
                      resizeMode="contain"
                      source={ArrowLeft}/>
              }
          </TouchableOpacity>
          <View style={[styles.navBarItem]}>
            <Text style={{fontSize: 18, color: '#ffffff'}}>{boardItem ? boardItem.name : title}</Text>
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
