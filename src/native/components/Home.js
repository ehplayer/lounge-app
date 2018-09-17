import React from 'react';
import PropTypes from 'prop-types';
import {
  Body,
  Card,
  CardItem,
  Container,
  Content,
  List,
  ListItem,
  Text,
  Left,
  Thumbnail,
  Button, Right
} from 'native-base';
import {Actions} from 'react-native-router-flux';
import moment from "moment/moment";
import {FlatList, Image} from "react-native";
import Loading from "./Loading";
import Error from "./Error";
import ArrowLeft from '../../images/arrow_right_gray.png';

class HomeComponent extends React.Component {

  static propTypes = {
    member: PropTypes.shape({}),
  };

  static defaultProps = {
    member: {},
  };
  constructor(props) {
    super(props);
    this.state = {
      currentUnivId: undefined
    };
  }
  static keyExtractor = item => String(item.toString());
  onPress = item => Actions.notice({match: {item: item}});

  openArticle = (boardType, item) => {
    return Actions.notice({
      title: item.title,
      param: {
        universe:this.props.member.universe,
        currentUnivId: item.currentUnivId,
        boardType: boardType,
        docId: item.docId}})
  };

  handleChange = (currentUnivId) => {
    this.setState({
      ...this.state,
      currentUnivId: currentUnivId,
    });
    this.props.reFetch(currentUnivId, this.props.member, true);
  }
  sectionColorMap = {
    hall: '#4a90e2',
    univ: '#2b66ae',
    club: '#5b8b2b'
  };
  sectionTextMap = {
    hall: 'Hall',
    univ: 'Univ.',
    club: 'Club'
  };

  render(){
    const {error, loading, home, member} = this.props;
    const noticeList = home.noticeList ? (home.noticeList.length > 5 ? home.noticeList.slice(0, 5) : home.noticeList) : [];
    const scheduleList = home.scheduleList ? (home.scheduleList.length > 5 ? home.scheduleList.slice(0, 5) : home.scheduleList) : [];
    const now = moment().format("MM.DD");
    if (loading) return <Loading/>;
    if (error) return <Error content={error}/>;

    return (
      <Container>
      <Content>
        <Card transparent>
          <CardItem style={{paddingBottom:0}}>
            <Body>
            <List>
              <ListItem style={{height: 40, paddingLeft:0, marginLeft:0, alignItems:'center'}} onPress={item => Actions.homeNoticeList({title: '공지사항'})}>
                <Text style={{width: '90%', paddingLeft:0, marginLeft:0, paddingBottom:20}}
                      onPress={item => Actions.homeNoticeList({title: '공지사항'})}>공지사항</Text>
                <Image
                  style={{width: 28, height: 20, marginLeft:10}}
                  resizeMode="contain"
                  source={ArrowLeft}/>
              </ListItem>
              <FlatList
                numColumns={1}
                data={noticeList}
                renderItem={({item, index}) => (
                  <ListItem key={item.articleId} onPress={() => this.openArticle('notice', item)} style={{height: 50, paddingLeft:0, marginLeft:0}}>
                    <Text style={{color: this.sectionColorMap[item.sectionType], width:'13%'}}>{this.sectionTextMap[item.sectionType]}</Text>
                    <Left>
                      <Body><Text numberOfLines={1} style={{fontWeight:'normal', color:'#000000'}}>{item.title}</Text></Body>
                    </Left>
                    <Right><Text note>{moment(item.createDateTime).format("MM.DD") === now ? '오늘' : moment(item.createDateTime).format("MM.DD")}</Text></Right>
                  </ListItem>
                )}
                keyExtractor={(item, index) => index + item.toString()}
              />
            </List>
            </Body>
          </CardItem>
        </Card>
        <Card transparent >
          <CardItem style={{paddingBottom:0}}>
            <Body>
            <List>
              <ListItem style={{height: 40, paddingLeft:0, marginLeft:0}} onPress={item => Actions.homeScheduleList({title: '일정'})}>
                <Text style={{width: '90%', paddingLeft:0, marginLeft:0, paddingBottom:20}}>일정</Text>
                <Image
                  style={{width: 28, height: 20, marginLeft:10}}
                  resizeMode="contain"
                  source={ArrowLeft}/>
              </ListItem>
              <FlatList
                numColumns={1}
                data={scheduleList}
                renderItem={({item, index}) => (
                    <ListItem style={{height: 70, paddingLeft:0, marginLeft:0}} onPress={() => this.openArticle('schedule', item)}>
                      <Button transparent style={{marginTop:5, height:29,backgroundColor:'#ffffff', borderColor: '#6D41DD', borderWidth: 0.5, borderRadius:15}} disabled>
                        <Text style={{fontSize:14, color:'#6D41DD', paddingLeft:5, paddingRight:5}}>{moment(item.startDatetimeLong).format("MM / DD")}</Text>
                      </Button>
                      <Left>
                        <Body style={{marginTop:5}}>
                        <Text style={{fontSize:15, fontWeight:'normal', color:'#000000'}}>{item.boardName}</Text>
                        <Text style={{marginTop:3, color:'#4a4a4a'}}>{item.title}</Text>
                        </Body>
                        <Thumbnail small source={{uri: item.boardThumb}} />
                      </Left>
                    </ListItem>
                )}
                keyExtractor={(item, index) => index + item.toString()}
              />
              {/*<ListItem style={{height: 70, paddingLeft:0, marginLeft:0}}>*/}
                {/*<Button transparent style={{marginTop:5, height:29,backgroundColor:'#ffffff', borderColor: '#6D41DD', borderWidth: 0.5, borderRadius:15}} disabled>*/}
                  {/*<Text style={{fontSize:14, color:'#6D41DD', paddingLeft:5, paddingRight:5}}>08 / 31</Text>*/}
                {/*</Button>*/}
                {/*<Left>*/}
                  {/*<Body style={{marginTop:5}}>*/}
                  {/*<Text style={{fontSize:15, fontWeight:'normal', color:'#000000'}}>{'연세대학교'}</Text>*/}
                  {/*<Text style={{marginTop:3, color:'#4a4a4a'}}>대한대 MBA 원우회와 민국대</Text>*/}
                  {/*</Body>*/}
                  {/*<Thumbnail small source={{uri: 'http://www.yonsei.ac.kr/_res/sc/img/intro/img_symbol6.png'}} />*/}
                {/*</Left>*/}
              {/*</ListItem>*/}
              {/*<ListItem style={{height: 70, paddingLeft:0, marginLeft:0}}>*/}
                {/*<Left>*/}
                  {/*<Body style={{marginTop:5, marginLeft:68}}>*/}
                  {/*<Text style={{fontSize:15, fontWeight:'normal'}}>{'연세대학교 테니스 동아리'}</Text>*/}
                  {/*<Text style={{marginTop:3, color:'#4a4a4a'}}>테니스 친선대회를 위한 연습</Text>*/}
                  {/*</Body>*/}
                  {/*<Thumbnail small source={{uri: 'https://mblogthumb-phinf.pstatic.net/MjAxNzA2MDdfODQg/MDAxNDk2ODE3ODg1NzI4.jmDTwzCui2puy4LFM8YFbUn4jWruf65eFm7H9S7BCoQg.SKWcwc0j_37dZjEWdt90F-igWwCDWZpJPv1eixvS9M8g.JPEG.ssun6302/%EC%88%98%EC%9B%90_%EB%A7%A4%EC%B9%98%ED%8F%AC%EC%9D%B8%ED%8A%B8_%EB%A1%9C%EA%B3%A0-%ED%9D%B0%EC%83%89%EB%B0%B0%EA%B2%BD.jpg?type=w800'}} />*/}
                {/*</Left>*/}
              {/*</ListItem>*/}
            </List>
            </Body>
          </CardItem>
        </Card>
      </Content>
    </Container>);
  }
}




export default HomeComponent;
