import React from 'react';
import PropTypes from 'prop-types';
import {FlatList, StyleSheet} from 'react-native';
import {
  Body,
  Button,
  Card,
  CardItem,
  Container,
  Content,
  Left,
  ListItem,
  Right,
  Separator,
  Text,
  Thumbnail
} from 'native-base';
import {Actions} from 'react-native-router-flux';
import Loading from './Loading';

const styles = StyleSheet.create({
  joinedButton: {
    borderWidth:1, borderColor:'#cccccc', marginLeft:5, marginTop:10, width:80, padding:0, height:35, justifyContent:'center'
  },
  joiningButton: {
    borderWidth:1, borderColor:'#394eb7', marginLeft:5, marginTop:10, width:80, padding:0, height:35, justifyContent:'center'
  },
});

class BoardListComponent extends React.Component {

  static propTypes = {
    error: PropTypes.object,
    loading: PropTypes.bool,
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
  };
  isJoined(item, authType){
    let isJoined = false;
    this.props.member[authType].forEach(auth =>{
      if(auth.boardId === item.docId){
        isJoined = true;
      }
    })
    return isJoined;
  }
  isJoinWaiting(item, authType){
    let isJoined = false;
    const authWaitingList = this.props.member[authType + 'Waiting'];
    if(!authWaitingList || authWaitingList.length === 0){
      return false;
    }

    authWaitingList.forEach(boardId =>{
      if(boardId === item.docId){
        isJoined = true;
      }
    })
    return isJoined;
  }

  join(univ, boardItem){
    this.props.applyBoard(univ, boardItem, this.props.member);
  }

  render() {
    const {loading, member, universeBoardList, clubBoardList} = this.props;
    if (loading) return <Loading/>;
    return (
      <Container>
        <Content style={{backgroundColor:'#ffffff'}}>
          <Card transparent style={{marginTop: 0}}>
            <CardItem style={{margin:0, padding:0}}>
              <FlatList
                data={universeBoardList}
                ListHeaderComponent={() => <ListItem style={{height: 50, marginLeft:0, marginRight:0}}><Text style={{width: '95%'}}>Univ. 목록</Text></ListItem>}
                ListEmptyComponent={() =>
                  <ListItem noBorder style={{height:70, justifyContent:'center'}}>
                    <Text style={{color:'#cccccc'}}>검색결과가 없습니다.</Text>
                  </ListItem> }
                renderItem={({item, index}) => (
                  <ListItem avatar style={{height:70, marginLeft:0, marginRight:0, borderBottomWidth:(index === universeBoardList.length -1 ? 0 : 0.5), borderBottomColor:'#cccccc'}}>
                    <Left style={{borderBottomWidth:0}}>
                      {item.thumb && item.thumb !== '#' ?
                        <Thumbnail source={{uri: item.thumb}} style={{width: 44, height: 44, borderRadius: 22}}/>
                        :
                        <Button style={{width:54, height:54, borderRadius: 40, backgroundColor:'#cccccc'}}/>
                      }
                    </Left>
                    <Body style={{borderBottomWidth:0, justifyContent:'center', width:'50%'}}>
                    <Text>{item.name}</Text>
                    </Body>
                    <Right style={{borderBottomWidth:0, width:'20%'}}>
                      <Body>
                        {this.isJoined(item, 'univAuth')
                          ?<Button transparent disabled style={styles.joinedButton}><Text style={{color:'#333333', fontWeight:'200'}}>가입됨</Text></Button>
                          : this.isJoinWaiting(item, 'univ') ? <Button transparent disabled style={styles.joinedButton}><Text style={{color:'#333333', fontWeight:'200'}}>대기중</Text></Button>
                                                      :<Button transparent onPress={() => this.join('univ', item)} style={styles.joiningButton}><Text style={{color:'#394eb7', fontWeight:'200'}}>가입</Text></Button>}
                      </Body>
                    </Right>
                  </ListItem>
                )}
                keyExtractor={(item) => item.docId}
              />
            </CardItem>
          </Card>
          <Separator style={{height: 10}}/>
            <Card transparent style={{marginTop: 0}}>
                <CardItem style={{margin:0, padding:0}}>
                    <FlatList
                        data={clubBoardList}
                        ListHeaderComponent={() => <ListItem style={{height: 50, marginLeft:0, marginRight:0}}><Text style={{width: '95%'}}>CLUB 목록</Text></ListItem>}
                        ListEmptyComponent={() =>
                            <ListItem noBorder style={{height:70, justifyContent:'center'}}>
                                <Text style={{color:'#cccccc'}}>검색결과가 없습니다.</Text>
                            </ListItem> }
                        renderItem={({item, index}) => (
                            <ListItem avatar style={{height:70, marginLeft:0, marginRight:0, borderBottomWidth:(index === clubBoardList.length -1 ? 0 : 0.5), borderBottomColor:'#cccccc'}}>
                                <Left style={{borderBottomWidth:0}}>
                                    {item.thumb && item.thumb !== '#' ?
                                        <Thumbnail source={{uri: item.thumb}} style={{width: 44, height: 44, borderRadius: 22}}/>
                                        :
                                        <Button style={{width:44, height:44, borderRadius: 40, backgroundColor:'#cccccc'}}/>
                                    }
                                </Left>
                                <Body style={{borderBottomWidth:0, justifyContent:'center', width:'50%'}}>
                                <Text>{item.name}</Text>
                                </Body>
                                <Right style={{borderBottomWidth:0, width:'20%'}}>
                                    <Body>
                                    {this.isJoined(item, 'clubAuth')
                                        ?<Button transparent disabled style={styles.joinedButton}><Text style={{color:'#333333', fontWeight:'200'}}>가입됨</Text></Button>
                                        : this.isJoinWaiting(item, 'club') ? <Button transparent disabled style={styles.joinedButton}><Text style={{color:'#333333', fontWeight:'200'}}>대기중</Text></Button>
                                            :<Button transparent onPress={() => this.join('club', item)} style={styles.joiningButton}><Text style={{color:'#394eb7', fontWeight:'200'}}>가입</Text></Button>}
                                    </Body>
                                </Right>
                            </ListItem>
                        )}
                        keyExtractor={(item) => item.docId}
                    />
                </CardItem>
            </Card>
        </Content>
      </Container>
    );
  }


};


export default BoardListComponent;
