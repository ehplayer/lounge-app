import {Image, Text, TouchableOpacity, View} from 'react-native'
import React from 'react'
import {Actions} from 'react-native-router-flux'
import {connect} from "react-redux";
import {LinearGradient} from 'expo';
import {Input, Right} from "native-base";
import leftArrow from '../../../images/arrow_left.png'
import search from '../../../images/search.png'
import {getSearchMemberList} from '../../../actions/member';

class SchedulerSearchNavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: this.props.searchName || '',
    };
    if(this.props.searchName){
      this.props.getSearchMemberList(this.props.searchName);
    }
    this.handleChange = this.handleChange.bind(this);
    this.search = this.search.bind(this)
  }

  handleChange = (name, val) => {
    this.setState({
      ...this.state,
      [name]: val,
    });
  }

  search = () => {
    this.props.getSearchMemberList(this.state.searchValue);
  }

  render() {
    return (
      <LinearGradient colors={['#394eb7', '#6965dc']} style={{flexDirection: 'row'}} start={[0, 0]} end={[1, 0]}>
        <TouchableOpacity
          onPress={Actions.pop}
          style={{justifyContent: 'center', paddingLeft: 10, paddingBottom: 20, paddingTop: 40}}>
          <Image
            style={{width: 15, height: 25}}
            resizeMode="contain"
            source={leftArrow}
          />
        </TouchableOpacity>
        <View style={{borderBottomWidth:1, borderBottomColor:'#ffffff', width:'73%', height:27, marginTop:45, marginLeft:20}}>
          <Input style={{fontSize: 20, color: '#ffffff'}}
                 value={this.state.searchValue}
                 onChangeText={v => this.handleChange('searchValue', v)}
          />
        </View>
        <TouchableOpacity
          onPress={() => this.search()}
          style={{justifyContent: 'center', paddingLeft: 10, paddingBottom: 20, paddingTop: 40}}>
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
const mapDispatchToProps = {
  getSearchMemberList,
};

export default connect(mapStateToProps, mapDispatchToProps)(SchedulerSearchNavBar);
