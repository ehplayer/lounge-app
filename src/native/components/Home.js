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
    Button, Right, Separator
} from 'native-base';
import {Actions} from 'react-native-router-flux';
import moment from "moment/moment";
import {FlatList, Image, RefreshControl} from "react-native";
import Loading from "./Loading";
import Error from "./Error";
import ArrowLeft from '../../images/arrow_right_gray.png';
import loungeStyle from "../constants/loungeStyle";

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
        sectionType: item.sectionType,
        universe: this.props.member.universe,
        currentUnivId: item.currentUnivId,
        boardType: boardType,
        docId: item.docId}})
  };

  onRefresh = () => {
      this.props.reFetch(this.props.member);
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
          <FlatList
              numColumns={1}
              data={scheduleList}
              ListHeaderComponent={
                <Card transparent style={{marginBottom:0}}>
                    <CardItem style={{paddingBottom:0}}>
                        <Body>
                        <List>
                            <ListItem style={loungeStyle.listHeaderListItem} onPress={item => Actions.homeNoticeList({title: '공지사항'})}>
                                <Text style={loungeStyle.listHeaderListItem_Text}
                                      onPress={item => Actions.homeNoticeList({title: '공지사항'})}>공지사항</Text>
                                <Image
                                    style={loungeStyle.listHeaderListItem_Image}
                                    resizeMode="contain"
                                    source={ArrowLeft}/>
                            </ListItem>
                            <FlatList
                                numColumns={1}
                                data={noticeList}
                                renderItem={({item, index}) => (
                                    <ListItem noBorder={index === noticeList.length - 1} key={item.articleId} onPress={() => this.openArticle('notice', item)} style={{height: 50, paddingLeft:0, marginLeft:0}}>
                                        <Text style={{color: this.sectionColorMap[item.sectionType], width:'13%'}}>{this.sectionTextMap[item.sectionType]}</Text>
                                        <Left>
                                            <Body><Text numberOfLines={1} style={{fontWeight:'normal', color:'#555555'}}>{item.title}</Text></Body>
                                        </Left>
                                        <Right><Text note>{moment(item.createDateTime).format("MM.DD") === now ? '오늘' : moment(item.createDateTime).format("MM.DD")}</Text></Right>
                                    </ListItem>
                                )}
                                keyExtractor={(item, index) => index + item.toString()}
                            />
                        </List>
                        </Body>
                    </CardItem>
                    <Separator style={{height: 10}}/>
                    <CardItem style={{paddingBottom:0}}>
                        <Body>
                        <List>
                            <ListItem style={loungeStyle.listHeaderListItem} onPress={item => Actions.homeScheduleList({title: '일정'})}>
                                <Text style={loungeStyle.listHeaderListItem_Text}>일정</Text>
                                <Image
                                    style={loungeStyle.listHeaderListItem_Image}
                                    resizeMode="contain"
                                    source={ArrowLeft}/>
                            </ListItem>

                        </List>
                        </Body>
                    </CardItem>
                </Card>
              }
              renderItem={({item, index}) => (
                  <ListItem noBorder style={{height: 70, paddingLeft:10, paddingRight:30, marginLeft:0, backgroundColor:'#ffffff'}} onPress={() => this.openArticle('schedule', item)}>
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
              refreshControl={
                  <RefreshControl
                      refreshing={loading}
                      onRefresh={this.onRefresh}
                  />
              }
          />
    </Container>);
  }
}




export default HomeComponent;
