import React from 'react';
import {Body, Button, Card, CardItem, Container, Content, Left, ListItem, Right, Text, Thumbnail} from 'native-base';
import {Actions} from 'react-native-router-flux';
import {FlatList, Image} from "react-native";
import Loading from "./Loading";
import uncheckedIcon from "../../images/checkX.png";

class Scheduler extends React.Component {

  static propTypes = {
  }

  static defaultProps = {
    searchUserList: [],
  };

  render() {
    const {loading, error, ownerList, userList} = this.props;
    if (loading) return <Loading/>;
    return (
      <Container>
      <Content>
        <Card transparent style={{marginTop: 0}}>
          <CardItem style={{margin:0, padding:0}}>
            <FlatList
              data={ownerList}
              ListHeaderComponent={() => <ListItem style={{height: 50, marginLeft:0, marginRight:0}}><Text style={{width: '95%'}}
                                                                              onPress={Actions.schedule}>원우회 목록</Text></ListItem>}
              ListEmptyComponent={() =>
                <ListItem noBorder style={{height:70, justifyContent:'center'}}>
                  <Text style={{color:'#cccccc'}}>검색결과가 없습니다.</Text>
                </ListItem> }
              renderItem={({item, index}) => (
                <ListItem avatar style={{height:70, borderBottomWidth:(index === ownerList.length -1 ? 0 : 1), borderBottomColor:'#dddddd'}}>
                  <Left style={{borderBottomWidth:0}}>
                    <Thumbnail small source={{uri: item.thumb}}/>
                  </Left>
                  <Body style={{borderBottomWidth:0}}>
                  <Text>{item.name}</Text>
                  </Body>
                  <Body style={{borderBottomWidth:0}}>
                  <Text style={{color: '#6D41DD'}}>{item.type}</Text>
                  <Text note>{item.className}</Text>
                  </Body>
                  <Right style={{borderBottomWidth:0, width:'40%'}}>
                    <Body>
                    <Text note numberOfLines={1} ellipsizeMode='tail'>{item.mbaType}</Text>
                    <Text note numberOfLines={1} ellipsizeMode='tail'>{item.company}</Text>
                    </Body>
                  </Right>
                </ListItem>
              )}
              keyExtractor={(item) => item.docId}
            />
          </CardItem>
        </Card>
        <Card transparent style={{marginTop: 0}}>
          <CardItem style={{margin:0, padding:0}}>
            <Body>
            <FlatList
                data={searchUserList}
                ListHeaderComponent={() => <ListItem onPress={() => this.addStepMemberList(item)} style={{height: 50, marginLeft:0, marginRight:0}}><Text style={{width: '95%'}}
                                                                                                                                                          onPress={Actions.schedule}>원우 목록</Text></ListItem>}
                ListEmptyComponent={() =>
                    <ListItem noBorder style={{height:70, justifyContent:'center'}}>
                        <Text style={{color:'#cccccc'}}>검색결과가 없습니다.</Text>
                    </ListItem> }
                renderItem={({item, index}) => (
                    <ListItem avatar onPress={() => this.addStepMemberList(item)} style={{height:70, marginLeft:0, marginRight:0, borderBottomWidth:(index === searchUserList.length -1 ? 0 : 1), borderBottomColor:'#dddddd'}}>
                        <Left style={{borderBottomWidth:0}}>
                            <Thumbnail small source={{uri: item.thumb}}/>
                        </Left>
                        <Body style={{borderBottomWidth:0, justifyContent:'center', width:'25%'}}>
                        <Text>{item.name}</Text>
                        </Body>
                        <Body style={{borderBottomWidth:0, margin:0}}>
                        <Text note>{item.className}</Text>
                        </Body>
                        <Right style={{borderBottomWidth:0,width:'30%'}}>
                            <Body>
                            <Text note numberOfLines={1} ellipsizeMode='tail'>{item.mbaType}</Text>
                            <Text note numberOfLines={1} ellipsizeMode='tail'>{item.company}</Text>
                            </Body>
                        </Right>
                        <Button transparent onPress={() => this.addStepMemberList(item)}>
                            <Image
                                style={{width: 28, height: 28, marginRight:10}}
                                resizeMode="contain"
                                source={uncheckedIcon}
                            />
                        </Button>
                    </ListItem>
                )}
                keyExtractor={(item) => item.docId}
            />
            </Body>
          </CardItem>
        </Card>
      </Content>
    </Container>);
  }

}

export default Scheduler;
