import React from 'react';
import PropTypes from 'prop-types';
import {FlatList, Image} from 'react-native';
import {Body, Button, Card, CardItem, Container, Content, Left, List, ListItem, Text, Thumbnail} from 'native-base';
import {Actions} from 'react-native-router-flux';
import Loading from './Loading';
import Error from './Error';
import ArrowDown from '../../images/arrow_down.png';
import moment from "moment";

class ScheduleList extends React.Component {

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
        const {error, loading, univ} = this.props;

        return (
            <Container>
                <Content>
                    <Card transparent style={{marginTop:0}} >
                        <CardItem style={{paddingBottom:0}}>
                            <Body>
                            <List>
                                <FlatList
                                    numColumns={1}
                                    data={univ.afterScheduleList}
                                    ListHeaderComponent={
                                        <ListItem style={{height: 40, paddingLeft:0, marginLeft:0,}}>
                                            <Text style={{width: '90%', paddingLeft:0, marginLeft:0, paddingBottom:20}}>예정된 일정</Text>
                                            <Image
                                                style={{width: 25, height: 20, marginLeft:10}}
                                                resizeMode="contain"
                                                source={ArrowDown}/>
                                        </ListItem>
                                    }
                                    renderItem={({item, index}) => (
                                        <ListItem style={{height: 70, paddingLeft:0, marginLeft:0}} onPress={() => this.openArticle('schedule', item)}>
                                            <Button transparent style={{marginTop:10, height:27,backgroundColor:'#ffffff', borderColor: '#6D41DD', borderWidth: 0.2, borderRadius:15}} disabled>
                                                <Text style={{fontSize:14, color:'#6D41DD', paddingLeft:5, paddingRight:5, fontWeight:'normal'}}>{moment(item.startDatetimeLong).format("MM / DD")}</Text>
                                            </Button>
                                            <Left>
                                                <Body style={{marginTop:0}}>
                                                <Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:15, fontWeight:'100', color:'#000000'}}>{item.title}</Text>
                                                <Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:13, marginTop:5, color:'#9a9a9a', fontWeight:'100'}}>
                                                    {item.boardName}
                                                    {item.joinerList && item.joinerList.length !== 0 ? ' 참석 ' + item.joinerList.length : ''}
                                                    {item.comment && item.comment.length !== 1 ? ' 댓글 ' + item.comment.length : ''}
                                                </Text>
                                                </Body>
                                                <Thumbnail small source={{uri: item.boardThumb}} />
                                            </Left>
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
                                <FlatList
                                    numColumns={1}
                                    data={univ.beforeScheduleList}
                                    ListHeaderComponent={
                                        <ListItem style={{height: 40, paddingLeft:0, marginLeft:0,}}>
                                            <Text style={{width: '100%', paddingLeft:0, marginLeft:0, paddingBottom:20}}>지난 일정</Text>
                                        </ListItem>
                                    }
                                    renderItem={({item, index}) => (
                                        <ListItem style={{height: 70, paddingLeft:0, marginLeft:0}} onPress={() => this.openArticle('schedule', item)}>
                                            <Button transparent style={{marginTop:10, height:27,backgroundColor:'#ffffff', borderColor: '#9b9b9b', borderWidth: 0.2, borderRadius:15}} disabled>
                                                <Text style={{fontSize:14, color:'#9b9b9b', paddingLeft:5, paddingRight:5, fontWeight:'normal'}}>{moment(item.startDatetimeLong).format("MM / DD")}</Text>
                                            </Button>
                                            <Left>
                                                <Body style={{marginTop:0}}>
                                                <Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:15, fontWeight:'100', color:'#9b9b9b'}}>{item.title}</Text>
                                                <Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:13, marginTop:5, color:'#9a9a9a', fontWeight:'100'}}>
                                                    {item.boardName}
                                                    {item.joinerList && item.joinerList.length !== 0 ? ' 참석 ' + item.joinerList.length : ''}
                                                    {item.comment && item.comment.length !== 1 ? ' 댓글 ' + item.comment.length : ''}
                                                </Text>
                                                </Body>
                                                <Thumbnail small source={{uri: item.boardThumb}} />
                                            </Left>
                                        </ListItem>
                                    )}
                                    keyExtractor={(item, index) => index + item.toString()}
                                />
                            </List>
                            </Body>
                        </CardItem>
                    </Card>
                </Content>
            </Container>
        );
    }


};


export default ScheduleList;
