import React from 'react';
import PropTypes from 'prop-types';
import {FlatList, Image, StyleSheet, TouchableOpacity} from 'react-native';
import moment from 'moment';
import {
    Body,
    Button,
    Card,
    CardItem,
    Container,
    Content,
    Form,
    Input,
    Left,
    Right,
    Text,
    Thumbnail,
    View
} from 'native-base';
import trashIcon from '../../images/trash.png'
import Loading from "./Loading";
import Modal from "react-native-modal";

const styles = StyleSheet.create({
  image: {
    width: 55, height: 48,
    paddingLeft: 30,
    backgroundColor: '#D8D8D8'
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
    height:260
  },
});
const bgColorMap = {
    hall: '#4581d9',
    home: '#535acb',
    univ: '#2b66ae',
    club: '#5b8b2b',
}

class Notice extends React.Component {

  static propTypes = {
    error: PropTypes.string,
    success: PropTypes.string,
    member: PropTypes.shape({
      email: PropTypes.string,
    }).isRequired,
  }

  static defaultProps = {
    error: null,
    success: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      commentText:''
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (name, val) => {
    this.setState({
      ...this.state,
      [name]: val,
    });
  };

  addComment = () => {
    this.props.addComment(this.props.param, this.state.commentText, this.props.member)
      .then(this.state.commentText = '');
  };
  removeComment = (item) => {
    this.props.removeComment(item, this.props.param, this.props.member);
  };
  addJoiner = () => {
      this.props.addJoiner(this.props.param, this.props.member);
  };
  removeJoiner = () => {
      this.props.removeJoiner(this.props.param, this.props.member);
  };
  renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  render() {
    const {loading, error, success, document, member} = this.props;
    if (loading || !document || !document.author) return <Loading/>;
    const sectionType = this.props.sectionType || this.props.param.sectionType;
    const bgColor = bgColorMap[sectionType] ? bgColorMap[sectionType] : bgColorMap['univ'];
    let isJoined = false;
    if(document.joinerList && document.joinerList.find(item => item.docId === member.docId)){
      isJoined = true;
    }
    return (
      <Container>
        <Content>
          <Form>
            <Card transparent style={{marginTop: 0}}>
              <CardItem>
                <Left>
                  <Thumbnail source={{uri: document.author.thumb}}/>
                  <Body>
                  <Text>{document.author.name}</Text>
                  <Text note>{moment(document.createDateTime).format("YYYY년 MM월 DD일 A hh:mm")}</Text>
                  </Body>
                </Left>
              </CardItem>
              <CardItem>
                <Body>
                  <Text style={{fontSize:25}}>{document.title}</Text>
                </Body>
              </CardItem>
                {(document.urlList && document.urlList[0]) &&
                  <CardItem cardBody>
                    <Image source={{uri: document.urlList && document.urlList[0]}} style={{height: 200, width: null, flex: 1}}/>
                  </CardItem>
                }
              <CardItem style={{paddingBottom:40}}>
                <Body>
                  <Text>{document.content}</Text>
                </Body>
              </CardItem>
              {document.isSchedule &&
              <CardItem style={{paddingBottom: 0, height:60}}>
                <Body style={{paddingTop:20, borderWidth:1, flexDirection:'row', borderBottomWidth:0.5, borderColor:'#cccccc', justifyContent:'center'}}>
                  <Text>{document.startDatetime}</Text>
                  <Text style={{paddingHorizontal: 10}}>~</Text>
                  <Text>{document.endDatetime}</Text>
                </Body>
              </CardItem>
              }
              {document.isSchedule &&
                <CardItem style={{paddingTop:0, paddingBottom:0, height:50}}>
                  <Body style={{paddingTop:15, marginTop:0, borderWidth:1, flexDirection:'row', borderTopWidth:0.5, borderBottomWidth:0.5, borderColor:'#cccccc', paddingLeft:'7%'}}>
                    <Text style={{paddingRight:15}}>장소</Text>
                    <Text note>{document.place}</Text>
                  </Body>
                </CardItem>
              }
              {document.isSchedule &&
              <CardItem style={{marginBottom: 50, paddingTop:0, height:50}}>
                <Left style={{width:'50%',paddingTop:0, marginTop:0, borderWidth:1, flexDirection:'row', borderTopWidth:0.5, borderColor:'#cccccc'}}>
                  <Button transparent style={{height:40, justifyContent:'center', width:'100%'}}>
                    <Text style={{paddingRight:15, color:bgColor}}><Text style={{fontSize:15, color:bgColor}}>참석</Text> <Text style={{color:bgColor}}>{document.joinerList ? document.joinerList.length : 0}</Text> <Text style={{color:bgColor}}>{'>'}</Text></Text>
                  </Button>
                </Left>
                <Left style={{width:'50%',paddingTop:0, marginTop:0, borderWidth:1, flexDirection:'row', borderTopWidth:0.5, borderColor:'#cccccc'}}>
                  <Button transparent style={{height:40, justifyContent:'center', backgroundColor:bgColor, width:'100%', borderRadius:0}}
                          onPress={isJoined ? this.removeJoiner : this.addJoiner }>
                    <Text style={{paddingRight:15, color:'#ffffff'}}>{isJoined ? '참석취소':'참석하기'}</Text>
                  </Button>
                </Left>
              </CardItem>
              }
            </Card>
            <Card transparent>
              <FlatList
                numColumns={1}
                data={document.comment}
                renderItem={({item, index}) => (
                  <CardItem style={{borderTopWidth:(index ===0 ? 0 : 0.5), borderColor:'#eeeeee', height:70}}>
                    <Left>
                      <Thumbnail small size={20} source={{uri: item.thumb}} />
                      <Body>
                        <Text style={{paddingBottom:5}}>{item.name}</Text>
                        <Text>{item.commentText}</Text>
                      </Body>
                    </Left>
                    <Right>
                      <TouchableOpacity onPress={() => {
                        this.setState({ visibleModal: true, removeItem:item});
                      }}>
                      <Text note style={{paddingBottom:5}}>{moment(item.createDateTime).format("MM/DD HH:mm")}</Text>
                      {item.docId === member.docId &&
                      <Image
                        style={{width: 15, height: 15, marginLeft:60}}
                        resizeMode="contain"
                        source={trashIcon}
                      />
                      }
                      </TouchableOpacity>
                    </Right>
                  </CardItem>
                )}
                keyExtractor={(item, index) => index + item.toString()}
              />
              <Modal
                isVisible={this.state.visibleModal}
                onBackdropPress={() => this.setState({visibleModal: false})}
              >
              <View style={styles.modalContent}>
                <Text style={{paddingTop:70, fontSize:16, fontWeight:'100'}}>댓글을 삭제하시겠습니까?</Text>
                <Body style={{alignItems: 'center', flexDirection: 'row', paddingTop: 70, paddingBottom: 40}}>
                <Button style={{width:120, height:50, justifyContent:'center', borderRadius:0, marginRight:5, backgroundColor:'#dddddd'}} onPress={() => this.setState({visibleModal: false})}>
                  <Text>취소</Text>
                </Button>
                <Button style={{width:120, height:50, justifyContent:'center', borderRadius:0, marginLeft:5, backgroundColor: bgColor}} onPress={() => {
                  this.removeComment(this.state.removeItem);
                  this.setState({visibleModal: false})
                }}>
                  <Text>확인</Text>
                </Button>
                </Body>
              </View>
              </Modal>
              <CardItem style={{borderTopWidth:1, borderColor:'#dddddd', height:50, paddingRight:0}}>
                <Left>
                  <Body>
                    <Input placeholder='댓글을 남겨보세요' onChangeText={v => this.handleChange('commentText', v)} value={this.state.commentText}/>
                  </Body>
                </Left>
                <Right style={{marginRight:0}}>
                  <Button onPress={this.addComment} style={{backgroundColor: bgColor, borderRadius: null, height:50}}><Text>등록</Text></Button>
                </Right>
              </CardItem>
            </Card>
          </Form>
        </Content>
      </Container>
    );
  }
}

export default Notice;
