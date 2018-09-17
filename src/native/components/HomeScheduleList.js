import React from 'react';
import PropTypes from 'prop-types';
import {Image} from 'react-native';
import {Body, Button, Card, CardItem, Container, Content, Left, List, ListItem, Text, Thumbnail} from 'native-base';
import {Actions} from 'react-native-router-flux';
import Loading from './Loading';
import Error from './Error';
import ArrowDown from '../../images/arrow_down.png';

class HomeScheduleList extends React.Component {

  static propTypes = {
    error: PropTypes.object,
    loading: PropTypes.bool,
    univNotice: PropTypes.arrayOf(PropTypes.shape()),
    reFetch: PropTypes.func,
  };

  static defaultProps = {
    error: null,
    reFetch: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      currentUnivId: undefined
    };
  }
  static keyExtractor = item => String(item.toString());
  onPress = item => Actions.notice({match: {item: item}});

  handleChange = (currentUnivId, val) => {
    this.setState({
      ...this.state,
      currentUnivId: currentUnivId,
    });
    this.props.reFetch(currentUnivId);
  }

  render() {
    // Loading
    if (loading) return <Loading/>;
    // Error
    if (error) return <Error content={error}/>;
    const {error, loading, univScheduleList} = this.props;
    return (
      <Container>
        <Content>
          <Card transparent style={{marginTop:0}} >
            <CardItem style={{paddingBottom:0}}>
              <Body>
              <List>
                <ListItem style={{height: 40, paddingLeft:0, marginLeft:0,}}
                          onPress={item => Actions.homeScheduleList({title: '일정'})}>
                  <Text style={{width: '90%', paddingLeft:0, marginLeft:0, paddingBottom:20}}>예정된 일정</Text>
                  <Image
                    style={{width: 25, height: 20, marginLeft:10}}
                    resizeMode="contain"
                    source={ArrowDown}/>
                </ListItem>
                <ListItem style={{height: 70, paddingLeft:0, marginLeft:0}}>
                  <Button transparent style={{marginTop:10, height:27,backgroundColor:'#ffffff', borderColor: '#6D41DD', borderWidth: 0.2, borderRadius:15}} disabled>
                    <Text style={{fontSize:14, color:'#6D41DD', paddingLeft:5, paddingRight:5, fontWeight:'normal'}}>08 / 31</Text>
                  </Button>
                  <Left>
                    <Body style={{marginTop:0}}>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:15, fontWeight:'100', color:'#000000'}}>{'대한대 MBA 원우회와 민국대'}</Text>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:13, marginTop:5, color:'#9a9a9a', fontWeight:'100'}}>연세대학교 참석 16 댓글4</Text>
                    </Body>
                    <Thumbnail small source={{uri: 'http://www.yonsei.ac.kr/_res/sc/img/intro/img_symbol6.png'}} />
                  </Left>
                </ListItem>
                <ListItem style={{height: 70, paddingLeft:0, marginLeft:0}}>
                  <Left>
                    <Body style={{marginTop:0, marginLeft:63}}>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:15, fontWeight:'100', color:'#000000'}}>{'테니스 친선대회를 위한 연습이 있습니다'}</Text>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:13, marginTop:5, color:'#9a9a9a', fontWeight:'100'}}>연세대학교</Text>
                    </Body>
                    <Thumbnail small source={{uri: 'https://mblogthumb-phinf.pstatic.net/MjAxNzA2MDdfODQg/MDAxNDk2ODE3ODg1NzI4.jmDTwzCui2puy4LFM8YFbUn4jWruf65eFm7H9S7BCoQg.SKWcwc0j_37dZjEWdt90F-igWwCDWZpJPv1eixvS9M8g.JPEG.ssun6302/%EC%88%98%EC%9B%90_%EB%A7%A4%EC%B9%98%ED%8F%AC%EC%9D%B8%ED%8A%B8_%EB%A1%9C%EA%B3%A0-%ED%9D%B0%EC%83%89%EB%B0%B0%EA%B2%BD.jpg?type=w800'}} />
                  </Left>
                </ListItem>
                <ListItem style={{height: 70, paddingLeft:0, marginLeft:0}}>
                  <Button transparent style={{marginTop:10, height:27,backgroundColor:'#ffffff', borderColor: '#6D41DD', borderWidth: 0.2, borderRadius:15}} disabled>
                    <Text style={{fontSize:14, color:'#6D41DD', paddingLeft:5, paddingRight:5, fontWeight:'normal'}}>10 / 17</Text>
                  </Button>
                  <Left>
                    <Body style={{marginTop:0}}>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:15, fontWeight:'100', color:'#000000'}}>{'대한대 MBA 원우회와 민국대'}</Text>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:13, marginTop:5, color:'#9a9a9a', fontWeight:'100'}}>연세대학교 참석 16 댓글4</Text>
                    </Body>
                    <Thumbnail small source={{uri: 'https://ntdtv.kr/assets/uploads/2016/07/15800.jpg'}} />
                  </Left>
                </ListItem>
                <ListItem style={{height: 70, paddingLeft:0, marginLeft:0}}>
                  <Left>
                    <Body style={{marginTop:0, marginLeft:63}}>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:15, fontWeight:'100', color:'#000000'}}>{'제 13회 골프 동아리 친선 모임'}</Text>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:13, marginTop:5, color:'#9a9a9a', fontWeight:'100'}}>연세대학교</Text>
                    </Body>
                    <Thumbnail small source={{uri: 'https://mblogthumb-phinf.pstatic.net/MjAxNzA2MDdfODQg/MDAxNDk2ODE3ODg1NzI4.jmDTwzCui2puy4LFM8YFbUn4jWruf65eFm7H9S7BCoQg.SKWcwc0j_37dZjEWdt90F-igWwCDWZpJPv1eixvS9M8g.JPEG.ssun6302/%EC%88%98%EC%9B%90_%EB%A7%A4%EC%B9%98%ED%8F%AC%EC%9D%B8%ED%8A%B8_%EB%A1%9C%EA%B3%A0-%ED%9D%B0%EC%83%89%EB%B0%B0%EA%B2%BD.jpg?type=w800'}} />
                  </Left>
                </ListItem>
              </List>
              </Body>
            </CardItem>
          </Card>
          <Card transparent >
            <CardItem style={{paddingBottom:0}}>
              <Body>
              <List>
                <ListItem style={{height: 40, paddingLeft:0, marginLeft:0,}}
                          onPress={item => Actions.homeScheduleList({title: '일정'})}>
                  <Text style={{width: '100%', paddingLeft:0, marginLeft:0, paddingBottom:20}}>지난 일정</Text>
                </ListItem>
                <ListItem style={{height: 70, paddingLeft:0, marginLeft:0}}>
                  <Button transparent style={{marginTop:10, height:27,backgroundColor:'#ffffff', borderColor: '#9b9b9b', borderWidth: 0.2, borderRadius:15}} disabled>
                    <Text style={{fontSize:14, color:'#9b9b9b', paddingLeft:5, paddingRight:5, fontWeight:'normal'}}>07 / 20</Text>
                  </Button>
                  <Left>
                    <Body style={{marginTop:0}}>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:15, fontWeight:'100', color:'#9b9b9b'}}>{'대한대 MBA 원우회와 민국대'}</Text>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:13, marginTop:5, color:'#9a9a9a', fontWeight:'100'}}>연세대학교 참석 16 댓글4</Text>
                    </Body>
                    <Thumbnail small source={{uri: 'http://www.yonsei.ac.kr/_res/sc/img/intro/img_symbol6.png'}} />
                  </Left>
                </ListItem>
                <ListItem style={{height: 70, paddingLeft:0, marginLeft:0}}>
                  <Left>
                    <Body style={{marginTop:0, marginLeft:63}}>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:15, fontWeight:'100', color:'#9b9b9b'}}>{'테니스 친선대회를 위한 연습이 있습니다'}</Text>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:13, marginTop:5, color:'#9a9a9a', fontWeight:'100'}}>연세대학교</Text>
                    </Body>
                    <Thumbnail small source={{uri: 'https://mblogthumb-phinf.pstatic.net/MjAxNzA2MDdfODQg/MDAxNDk2ODE3ODg1NzI4.jmDTwzCui2puy4LFM8YFbUn4jWruf65eFm7H9S7BCoQg.SKWcwc0j_37dZjEWdt90F-igWwCDWZpJPv1eixvS9M8g.JPEG.ssun6302/%EC%88%98%EC%9B%90_%EB%A7%A4%EC%B9%98%ED%8F%AC%EC%9D%B8%ED%8A%B8_%EB%A1%9C%EA%B3%A0-%ED%9D%B0%EC%83%89%EB%B0%B0%EA%B2%BD.jpg?type=w800'}} />
                  </Left>
                </ListItem>
                <ListItem style={{height: 70, paddingLeft:0, marginLeft:0}}>
                  <Button transparent style={{marginTop:10, height:27,backgroundColor:'#ffffff', borderColor: '#9b9b9b', borderWidth: 0.2, borderRadius:15}} disabled>
                    <Text style={{fontSize:14, color:'#9b9b9b', paddingLeft:5, paddingRight:5, fontWeight:'normal'}}>10 / 17</Text>
                  </Button>
                  <Left>
                    <Body style={{marginTop:0}}>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:15, fontWeight:'100', color:'#9b9b9b'}}>{'대한대 MBA 원우회와 민국대'}</Text>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:13, marginTop:5, color:'#9b9b9b', fontWeight:'100'}}>연세대학교 참석 16 댓글4</Text>
                    </Body>
                    <Thumbnail small source={{uri: 'https://ntdtv.kr/assets/uploads/2016/07/15800.jpg'}} />
                  </Left>
                </ListItem>
                <ListItem style={{height: 70, paddingLeft:0, marginLeft:0}}>
                  <Left>
                    <Body style={{marginTop:0, marginLeft:63}}>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:15, fontWeight:'100', color:'#9b9b9b'}}>{'테니스 강사 초청'}</Text>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:13, marginTop:5, color:'#9a9a9a', fontWeight:'100'}}>연세대학교</Text>
                    </Body>
                    <Thumbnail small source={{uri: 'https://mblogthumb-phinf.pstatic.net/MjAxNzA2MDdfODQg/MDAxNDk2ODE3ODg1NzI4.jmDTwzCui2puy4LFM8YFbUn4jWruf65eFm7H9S7BCoQg.SKWcwc0j_37dZjEWdt90F-igWwCDWZpJPv1eixvS9M8g.JPEG.ssun6302/%EC%88%98%EC%9B%90_%EB%A7%A4%EC%B9%98%ED%8F%AC%EC%9D%B8%ED%8A%B8_%EB%A1%9C%EA%B3%A0-%ED%9D%B0%EC%83%89%EB%B0%B0%EA%B2%BD.jpg?type=w800'}} />
                  </Left>
                </ListItem>
              </List>
              </Body>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }


};


export default HomeScheduleList;
