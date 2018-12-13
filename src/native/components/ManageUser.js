import React from 'react';
import {Body, Button, Card, CardItem, Container, Content, Left, ListItem, Right, Text, Thumbnail} from 'native-base';
import {Actions} from 'react-native-router-flux';
import {FlatList, Image} from "react-native";
import Loading from "./Loading";
import uncheckedIcon from "../../images/checkX.png";
import checkedIcon from "../../images/checkO.png";

class Scheduler extends React.Component {

    static propTypes = {}

    static defaultProps = {
        searchUserList: [],
    };

    constructor(props) {
        super(props);
        this.state = {
            checkMap: new Map()
        };
    }

    showMemberInfo = (item) => {
        Actions.otherProfile({docId: item.docId})
    };
    checkMember = (item) => {
        const {checkMap} = this.state;
        if(checkMap.has(item.docId)){
            checkMap.delete(item.docId)
        } else {
            checkMap.set(item.docId, item);
        }
        this.setState({
            ...this.state,
            checkMap: checkMap,
        });
    };

    approveMember = () => {
        this.props.approveUser(this.state.checkMap)
            .then(() => Actions.pop());
    };

    render() {
        const {loading, error, userList} = this.props;
        if (loading) return <Loading/>;

        return (
            <Container>
                <Content>
                    <Card transparent style={{marginTop: 0}}>
                        <CardItem style={{margin: 0, padding: 0}}>
                            <FlatList
                                data={userList}
                                ListHeaderComponent={() =>
                                    <ListItem style={{
                                            height: 50,
                                            marginLeft: 0,
                                            marginRight: 0,
                                        }}>
                                        <Text style={{width: '85%'}}>신청자 목록</Text>
                                        <Left>
                                            <Button transparent
                                                    onPress={this.approveMember}
                                                    style={{
                                                        height: 34,
                                                        width:60,
                                                        backgroundColor: '#ffffff',
                                                        borderColor: '#394eb7',
                                                        borderWidth: 0.5,
                                                        borderRadius: 15,
                                            }} >
                                                <Text style={{color: '#394eb7'}}>승인</Text>
                                            </Button>
                                        </Left>
                                    </ListItem>}
                                ListEmptyComponent={() =>
                                    <ListItem noBorder style={{height: 70, justifyContent: 'center'}}>
                                        <Text style={{color: '#cccccc'}}>신청자가 없습니다.</Text>
                                    </ListItem>}
                                renderItem={({item, index}) => {
                                    return <ListItem avatar onPress={() => this.showMemberInfo(item)} style={{
                                        height: 70,
                                        marginLeft: 0,
                                        marginRight: 0,
                                        borderBottomWidth: (index === userList.length - 1 ? 0 : 0.3),
                                        borderBottomColor: '#dddddd',
                                    }}>
                                        <Left style={{borderBottomWidth: 0}}>
                                            <Thumbnail small source={{uri: item.thumb}}/>
                                        </Left>
                                        <Body style={{
                                            borderBottomWidth: 0,
                                            justifyContent: 'center',
                                            width: '25%',
                                            overflow: "hidden"
                                        }}>
                                        <Text style={{width: 100,}}>{item.name}</Text>
                                        </Body>
                                        <Body style={{borderBottomWidth: 0, margin: 0, padding: 0, width: '25%'}}>
                                        <Text style={{width: 100}} note>{item.phone}</Text>
                                        </Body>
                                        <Right style={{borderBottomWidth: 0, width: '20%'}}>
                                            <Button transparent onPress={() => this.checkMember(item)}>
                                                <Image
                                                    style={{width: 35, height: 35}}
                                                    resizeMode="contain"
                                                    source={this.state.checkMap.get(item.docId) ? checkedIcon : uncheckedIcon}
                                                />
                                            </Button>
                                        </Right>

                                    </ListItem>
                                }
                                }
                                keyExtractor={(item) => item.docId}
                            />
                        </CardItem>
                    </Card>
                </Content>
            </Container>);
    }
}

export default Scheduler;
