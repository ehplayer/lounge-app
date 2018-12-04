import React from 'react';
import {Body, Card, CardItem, Container, Content, Left, ListItem, Right, Text, Thumbnail} from 'native-base';
import {Actions} from 'react-native-router-flux';
import {FlatList} from "react-native";
import Loading from "./Loading";

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
            <Body>
            <FlatList
              data={userList}
              ListHeaderComponent={() => <ListItem style={{height: 50, marginLeft:0, marginRight:0}}><Text style={{width: '100%'}}>원우 목록</Text></ListItem>}
              ListEmptyComponent={() =>
              <ListItem noBorder style={{height:70, justifyContent:'center'}}>
                <Text style={{color:'#cccccc'}}>일치하는 원우가 없습니다.</Text>
              </ListItem> }
              renderItem={({item, index}) => {
                  if(item.email === 'mbalounge@lounge.com') {
                      return;
                  }
                  return <ListItem avatar style={{height:70, marginLeft:0, marginRight:0,justifyContent:'center', borderBottomWidth:(index === userList.length - 1 ? 0 : 0.3), borderBottomColor:'#cccccc'}}
                                onPress={() => Actions.otherProfile({docId:item.docId})}>
                          <Left style={{borderBottomWidth:0}}>
                              <Thumbnail small source={{uri: item.thumb}}/>
                          </Left>
                          <Left style={{borderBottomWidth:0, justifyContent:'center', width:'30%'}}>
                              <Text ellipsizeMode='tail'>{item.name}</Text>
                          </Left>
                          <Body style={{borderBottomWidth:0, justifyContent:'center'}}>
                          <Text style={{color: '#6D41DD'}}>{item.mbaType}</Text>
                          <Text note>{item.className}</Text>
                          </Body>
                          <Left style={{borderBottomWidth:0,justifyContent:'flex-start', width:'30%'}}>
                              <Text note numberOfLines={3} ellipsizeMode='tail'>{item.company}</Text>
                          </Left>
                      </ListItem>

              }}
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
