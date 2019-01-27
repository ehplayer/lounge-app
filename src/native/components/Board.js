import React from 'react';
import PropTypes from 'prop-types';
import {
    BackHandler,
    DeviceEventEmitter,
    Dimensions,
    FlatList,
    Image,
    Platform,
    RefreshControl,
    TouchableHighlight,
    TouchableOpacity,
    View
} from 'react-native';
import {
    Body,
    Button,
    Card,
    CardItem,
    Container,
    Left,
    List,
    ListItem,
    Right,
    Separator,
    Text,
    Thumbnail
} from 'native-base';
import {Actions} from 'react-native-router-flux';
import Loading from './Loading';
import Error from './Error';
import ActionButton from 'react-native-action-button';
import moment from "moment/moment";
import ArrowRight from '../../images/arrow_right_gray.png';
import ArrowDown from '../../images/arrow_down.png';
import PencilIcon from '../../images/pencil.png';
import ModalDropDown from 'react-native-modal-dropdown';
import loungeStyle from "../constants/loungeStyle";
import Modal from "react-native-modal";

class BoardComponent extends React.Component {

    static propTypes = {
        error: PropTypes.object,
        loading: PropTypes.bool.isRequired,
        reFetch: PropTypes.func,
    };

    static defaultProps = {
        error: null,
        reFetch: null,
    };

    constructor(props) {
        super(props);
        this.backPressSubscriptions = new Set();
        this.state = {
            visibleExitModal: false,
            currentUnivId: undefined,
        };
        this.showDropDown = this.showDropDown.bind(this);
    }

    static keyExtractor = item => String(item.toString());

    componentDidMount() {
        if (Platform.OS === 'android') {
            // there is a bug/workaround on android https://github.com/facebook/react-native/issues/3223#issuecomment-355064410
            DeviceEventEmitter.removeAllListeners('hardwareBackPress');
            DeviceEventEmitter.addListener('hardwareBackPress', () => {
                let invokeDefault = true;
                const subscriptions = [];

                this.backPressSubscriptions.forEach(sub => subscriptions.push(sub));

                for (let i = 0; i < subscriptions.reverse().length; i += 1) {
                    if (subscriptions[i]()) {
                        invokeDefault = false;
                        break;
                    }
                }

                if (invokeDefault) {
                    BackHandler.exitApp();
                }
            });

            this.backPressSubscriptions.add(this.handleHardwareBack);
        }
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            DeviceEventEmitter.removeAllListeners('hardwareBackPress');
            this.backPressSubscriptions.clear();
        }

    }

    handleHardwareBack = (e) => {
        if (Actions.currentScene === 'login' ||
            Actions.currentScene === '_home' ||
            Actions.currentScene === '_hall' ||
            Actions.currentScene === '_univ' ||
            Actions.currentScene === '_club') {

            this.setState({
                ...this.state,
                visibleExitModal: !this.state.visibleExitModal,
            });
        } else {
            Actions.pop();
        }

        return true;
    };
    exitApp = () => {
        this.setState({
            ...this.state,
            visibleExitModal: false,
        });
        BackHandler.exitApp();
    }

    openArticle = (boardType, item) => {
        return Actions.notice({
            title: item.boardName,
            param: {
                sectionType: this.props.sectionType,
                universe: this.props.member.universe,
                currentUnivId: this.props.document.currentUnivId,
                boardType: boardType,
                docId: item.docId
            }
        })
    };

    onChangeBoard = (board, isLast) => {
        if (isLast) {
            return Actions.boardList();
        }
        this.setState({
            ...this.state,
            currentUnivId: board.docId,
        });
        this.props.reFetch(board.docId, this.props.member, true);
    }
    onRefresh = (currentBoardId) => {
        this.props.reFetch(currentBoardId, this.props.member, true);
    }

    renderRow(boardItem) {
        return (
            <TouchableHighlight>
                <View style={{
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    height: 50,
                    alignItems: 'center',
                    paddingLeft: '7%'
                }}>
                    <Thumbnail source={{uri: boardItem.thumb}} style={{width: 33, height: 33, borderRadius: 16}}/>
                    <Text style={{marginLeft: 23}}>{boardItem.name}</Text>
                </View>
            </TouchableHighlight>
        );
    }

    renderSeparator(sectionId, rowId, boardLength) {
        const isLast = rowId === (boardLength - 2 + '');
        return (<View style={{height: (isLast ? 10 : 0.5), backgroundColor: isLast ? '#ededed' : '#cccccc'}}
                      key={'spr' + rowId}/>);
    }

    showDropDown() {
        this.refs.dropdown.show();
    }

    render() {
        const {error, loading, document, member, moreFetch, sectionType, boardColor, hideBoardSelectMenu, menu} = this.props;
        const boardItem = document.boardList && (!this.state.currentUnivId ? document.boardList[0] : document.boardList.filter(item => item.docId === this.state.currentUnivId)[0])
        const now = moment().format("MM.DD");

        if (document.boardList && document.boardList.length > 0 && document.boardList[document.boardList.length - 1].name !== '게시판 가입하기..') {
            document.boardList.push({name: '게시판 가입하기..', thumb: '#'});
        }
        if (loading) return <Loading/>;
        if (error) return <Error content={error}/>;

        if (!boardItem) {
            return <Container>
                <Card transparent style={{marginTop: 0, paddingTop: 0}}>

                    <CardItem style={{paddingTop: 130, paddingBottom: 0, marginBottom: 0}}>
                        <Left style={{alignContent: 'center', justifyContent: 'center'}}>
                            <Text style={{paddingLeft: 0, marginLeft: 0, color: '#cccccc', fontSize: 15}}>가입하신 Club이
                                없습니다.</Text>
                        </Left>

                    </CardItem>
                    <CardItem style={{paddingTop: 40, paddingBottom: 0, marginBottom: 0}}>
                        <TouchableOpacity onPress={Actions.boardList}>
                            <Left style={{alignContent: 'center', justifyContent: 'center'}}>
                                <Text style={{paddingLeft: 0, marginLeft: 0, color: '#000000', height: 20}}>Univ./Club
                                    가입화면으로 이동</Text>
                                <Image
                                    style={{width: 17, height: 17, marginLeft: 5}}
                                    resizeMode="contain"
                                    source={ArrowRight}/>
                            </Left>
                        </TouchableOpacity>
                    </CardItem>
                </Card>
            </Container>;
        }

        return (
            <Container>
                <List style={{backgroundColor: '#ffffff'}}>
                    <FlatList
                        numColumns={1}
                        data={document.articleList}
                        ListHeaderComponent={
                            <View>
                                {!hideBoardSelectMenu &&
                                <Card transparent style={{marginTop:0, marginLeft:0, marginRight:0, marginBottom:0, padding:0, borderTopWidth:0, paddingBottom: 0, height: 76}}>
                                    <TouchableOpacity onPress={this.showDropDown}>
                                        <CardItem style={{margin: 0, paddingBottom: 0, borderBottomWidth:0, justifyContent:'center'}}>
                                            <Thumbnail source={{uri: boardItem && boardItem.thumb}}
                                                       style={{width: 44, height: 44, borderRadius: 22, marginTop:7}}/>
                                            <ModalDropDown ref="dropdown"
                                                           style={{
                                                               alignSelf: 'flex-end',
                                                               width: '70%',
                                                               right: 8,
                                                               marginLeft: 20,
                                                               paddingLeft: 0,
                                                           }}
                                                           textStyle={{
                                                               marginVertical: 10,
                                                               marginHorizontal: 6,
                                                               fontSize: 15,
                                                               color: '#000000',
                                                               fontWeight: '100',
                                                               textAlign: 'left',
                                                               textAlignVertical: 'center',
                                                           }}
                                                           dropdownStyle={{
                                                               width: '100%',
                                                               height: Dimensions.get('window').height,
                                                               backgroundColor: "rgba(0, 0, 0, 0.5)",
                                                               paddingBottom: Dimensions.get('window').height - 165,
                                                           }}
                                                           options={document.boardList}
                                                           defaultValue={boardItem && boardItem.name}
                                                           renderButtonText={(rowData) => rowData.name}
                                                           renderRow={this.renderRow.bind(this)}
                                                           renderSeparator={(sectionID, rowID) => this.renderSeparator(sectionID, rowID, document.boardList.length)}
                                                           adjustFrame={(adjust) => {
                                                               return {
                                                                   ...adjust,
                                                                   left: 0,
                                                                   top: adjust.top + (Platform.OS === 'ios' ? 18 : -7)
                                                               };
                                                           }}
                                                           onSelect={(index, value) => this.onChangeBoard(value, index === document.boardList.length - 1 + "")}
                                            />
                                            <Image
                                                style={loungeStyle.listHeaderListItem_Image}
                                                resizeMode="contain"
                                                source={ArrowDown}/>
                                        </CardItem>
                                    </TouchableOpacity>
                                </Card>
                                }
                                {!hideBoardSelectMenu && <Separator style={{height: 5, backgroundColor: '#f2f4f7'}}/>}

                                <Card transparent style={{marginTop:0, marginLeft:0, marginRight:0, marginBottom:0, borderWidth:0, paddingBottom: 0}}>
                                    <CardItem style={{paddingBottom: 0}}>
                                        <Body>
                                        <List>
                                            <ListItem noBorder={document.noticeList.length < 1} style={loungeStyle.listHeaderListItem}
                                                      onPress={() => Actions.noticeList({
                                                          boardItem,
                                                          sectionType: sectionType
                                                      })}>
                                                <Text style={loungeStyle.listHeaderListItem_Text}>공지사항</Text>
                                                <Image
                                                    style={loungeStyle.listHeaderListItem_Image}
                                                    resizeMode="contain"
                                                    source={ArrowRight}/>
                                            </ListItem>
                                            <FlatList
                                                numColumns={1}
                                                data={document.noticeList && document.noticeList.length > 3 ? document.noticeList.slice(0, 3) : document.noticeList}
                                                renderItem={({item, index}) => (
                                                    <ListItem
                                                        noBorder={index === 2 || index === document.noticeList.length - 1}
                                                        key={item.articleId}
                                                        onPress={() => this.openArticle('notice', item)} style={{
                                                        height: 50,
                                                        paddingLeft: 0,
                                                        marginLeft: 10,
                                                        marginRight: 0
                                                    }}>
                                                        <Left style={{marginLeft: 0}}>
                                                            <Body style={{marginLeft: 0}}><Text numberOfLines={1}
                                                                                                style={{
                                                                                                    fontWeight: 'normal',
                                                                                                    color: '#555555'
                                                                                                }}>{item.title}</Text></Body>
                                                        </Left>
                                                        <Right><Text
                                                            note>{moment(item.createDateTime).format("MM.DD") === now ? '오늘' : moment(item.createDateTime).format("MM.DD")}</Text></Right>
                                                    </ListItem>
                                                )}
                                                keyExtractor={(item, index) => index + item.toString()}
                                            />
                                        </List>
                                        </Body>
                                    </CardItem>
                                </Card>
                                <Separator style={{height: 5, backgroundColor: '#f2f4f7'}}/>
                                <Card transparent style={{marginTop:0, marginLeft:0, marginRight:0, marginBottom:0, borderWidth:0, paddingBottom: 0}}>
                                    <CardItem style={{paddingBottom: 0, marginBottom: 0, }}>
                                        <Body>
                                        <List>
                                            <ListItem noBorder={document.scheduleList.length < 1} style={loungeStyle.listHeaderListItem}
                                                      onPress={() => Actions.scheduleList({
                                                          boardItem,
                                                          sectionType: sectionType
                                                      })}>
                                                <Text style={loungeStyle.listHeaderListItem_Text}>일정</Text>
                                                <Image
                                                    style={loungeStyle.listHeaderListItem_Image}
                                                    resizeMode="contain"
                                                    source={ArrowRight}/>
                                            </ListItem>
                                            {document.scheduleList && document.scheduleList[0] &&
                                            <ListItem noBorder style={{marginLeft: 10, height: 75}}
                                                      onPress={() => this.openArticle('notice', document.scheduleList[0])}>
                                                <Text style={{
                                                    fontSize: 14,
                                                    color: boardColor,
                                                    paddingLeft: 5,
                                                    paddingRight: 5,
                                                    fontWeight: 'normal',
                                                    width: 60
                                                }}>
                                                    {moment(document.scheduleList[0].startDatetimeLong).format('MM / DD')}
                                                </Text>
                                                <Left>
                                                    <Body style={{
                                                        alignContent: "center",
                                                        marginTop: 10,
                                                        paddingLeft: 10
                                                    }}>
                                                    <Text style={{
                                                        fontSize: 15,
                                                        fontWeight: '100',
                                                        color: '#555555'
                                                    }}>{document.scheduleList[0].title}</Text>
                                                    <Text note style={{paddingTop: 5, color: boardColor, fontSize: 13}}>
                                                        {'참석 ' + (document.scheduleList[0].joinerList && document.scheduleList[0].joinerList.length !== 0 ? document.scheduleList[0].joinerList.length : 0)}
                                                        {document.scheduleList[0].comment && document.scheduleList[0].comment.length !== 0 ? ' / 댓글 ' + document.scheduleList[0].comment.length : ''}
                                                    </Text>
                                                    </Body>
                                                </Left>
                                            </ListItem>
                                            }
                                        </List>
                                        </Body>
                                    </CardItem>
                                </Card>
                                <View style={{flexDirection: 'row', marginLeft:25, paddingVertical:12}}>
                                    <Text style={{color: '#6d7381', fontSize:14.5}}>최신 게시물</Text>
                                </View>
                            </View>
                        }
                        style={{backgroundColor: '#f2f4f7'}}
                        renderItem={({item, index}) => (
                            <ListItem key={item.articleId}
                                      style={{height: item.urlList && item.urlList.length > 0 ? 300 : 170,
                                          backgroundColor: '#ffffff', borderWidth:0.3,
                                          borderColor:'#979797', justifyContent:'flex-start', marginBottom:5, marginRight:17}}
                                      onPress={() => this.openArticle('article', item)}>
                                <View style={{backgroundColor: '#ffffff', paddingBottom:5, margin:0, width:'100%'}}>
                                    <View style={{marginTop:25, marginLeft:17, flexDirection:'row', height:22}}>
                                        <Text numberOfLines={1} ellipsizeMode='tail' style={{paddingLeft:0, fontSize:17, fontWeight: '500', color: '#4a4a4a'}}>{item.title}</Text>
                                    </View>
                                    <View style={{paddingTop:10, marginLeft:17, flexDirection:'row'}}>
                                        <Text style={{fontSize: 13, color: '#979797', fontWeight:'700'}}>{item.author.name} </Text>
                                        <Text style={{fontSize: 13, color: '#979797', fontWeight:'400', marginLeft:5}}> {moment(item.createDateTime).format("MM.DD") === now ? '오늘' : moment(item.createDateTime).format("MM.DD")} </Text>
                                        <Text style={{
                                            color: boardColor, fontSize: 13, fontWeight:'600', marginLeft:5
                                        }}> {item.comment && item.comment.length !== 0 ? '댓글 ' + item.comment.length : ''}</Text>
                                    </View>
                                    {item.urlList && item.urlList.length > 0 &&
                                    <View style={{height:150, paddingTop:10, width:'100%', marginLeft:17, flexDirection:'row'}}>
                                        <Image resizeMode={'contain'} source={{uri: item.urlList[0]}} style={{height: 150, flex: 1}}/>
                                    </View>
                                    }
                                    <View style={{height: item.urlList && item.urlList.length > 0 ? 40 : 70, marginTop:10, marginLeft:17, flexDirection:'row'}}>
                                        <Text numberOfLines={item.urlList && item.urlList.length > 0 ? 2 : 3} ellipsizeMode='tail' style={{paddingLeft:0, fontSize:14, fontWeight: '100', color: '#4a4a4a'}}>{item.content}</Text>
                                    </View>


                                    {/*<Body style={{marginLeft: 0, paddingLeft: 0, marginTop: 5}}>*/}
                                    {/*<Text numberOfLines={1} style={{fontWeight: '100', color: '#555555'}}>{item.title}</Text>*/}
                                    {/*<Text note style={{marginTop: 3}}>*/}
                                        {/*<Text note style={{fontSize: 13}}>{item.author.name} </Text>*/}
                                        {/*<Text note*/}
                                              {/*style={{fontSize: 13}}> {moment(item.createDateTime).format("MM.DD") === now ? '오늘' : moment(item.createDateTime).format("MM.DD")} </Text>*/}
                                        {/*<Text style={{*/}
                                            {/*color: boardColor,*/}
                                            {/*fontSize: 13*/}
                                        {/*}}> {item.comment && item.comment.length !== 0 ? '댓글 ' + item.comment.length : ''}</Text>*/}
                                    {/*</Text>*/}
                                    {/*</Body>*/}
                                    {/*{item.urlList && item.urlList.length > 0 && <Thumbnail square*/}
                                                                                           {/*source={{uri: (item.urlList && item.fileNameList && item.urlList[0].replace(item.fileNameList[0], 'thumb_' + item.fileNameList[0]))}}/>}*/}
                                </View>
                            </ListItem>
                        )}
                        keyExtractor={(item, index) => index + item.toString()}
                        refreshControl={
                            <RefreshControl
                                refreshing={loading}
                                onRefresh={() => this.onRefresh(boardItem.docId)}
                            />
                        }
                        onEndReachedThreshold={0.5}
                        onEndReached={(info) => {
                            moreFetch(boardItem.docId, member, sectionType, document.articleList[document.articleList.length - 1]);
                        }}
                    />
                </List>
                <ActionButton
                    buttonColor={boardColor}
                    onPress={() => Actions.createArticle({
                        boardType: sectionType === 'hall' ? 'hall' : member.universe + sectionType,
                        boardItem: boardItem,
                        sectionType: sectionType
                    })}
                    renderIcon={() => <Image
                        style={{width: 28, height: 28}}
                        resizeMode="contain"
                        source={PencilIcon}
                    />}
                />
                <Modal
                    isVisible={this.state.visibleExitModal}
                    onBackdropPress={() => this.setState({visibleExitModal: false})}
                >
                    <View style={loungeStyle.exitModal}>
                        <Text style={{paddingTop: 70, fontSize: 16, fontWeight: '100'}}>앱을 종료하시겠습니까?</Text>
                        <Body style={{
                            alignItems: 'center',
                            flexDirection: 'row',
                            paddingTop: 70,
                            paddingBottom: 40
                        }}>
                        <Button style={{
                            width: 120,
                            height: 50,
                            justifyContent: 'center',
                            borderRadius: 0,
                            marginRight: 5,
                            backgroundColor: '#dddddd'
                        }} onPress={() => this.setState({visibleExitModal: false})}>
                            <Text>취소</Text>
                        </Button>
                        <Button style={{
                            width: 120,
                            height: 50,
                            justifyContent: 'center',
                            borderRadius: 0,
                            marginLeft: 5,
                            backgroundColor: '#535acb'
                        }} onPress={this.exitApp}>
                            <Text>확인</Text>
                        </Button>
                        </Body>
                    </View>
                </Modal>
            </Container>
        );
    }
};

export default BoardComponent;
