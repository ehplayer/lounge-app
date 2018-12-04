import React from 'react';
import PropTypes from 'prop-types';
import {FlatList, View} from 'react-native';
import {Body, Button, Container, Content, Left, List, ListItem, Text, Thumbnail} from 'native-base';
import {Actions} from 'react-native-router-flux';
import Loading from './Loading';
import Error from './Error';
import moment from "moment/moment";


class NoticeList extends React.Component {

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

  openArticle = (boardType, item) => {
    return Actions.notice({
      title: item.boardName,
      param: {
        sectionType: item.sectionType,
        universe:this.props.member.universe,
        currentUnivId:item.currentUnivId,
        boardType: boardType,
        docId: item.docId}})
  };

  render() {
    // Loading
    if (loading) return <Loading/>;
    // Error
    if (error) return <Error content={error}/>;
    const {error, loading, univ} = this.props;

    return (
      <Container>
        <Content style={{backgroundColor:'#ffffff'}}>
          <List>
            <FlatList
              numColumns={1}
              data={univ.noticeList}
              renderItem={({item}) => (
                <ListItem style={{height: 70, marginRight:20, paddingRight:0}} onPress={() => this.openArticle('notice', item)}>
                  <Left style={{justifyContent:'center', alignItems:'center', marginVertical:0, paddingVertical:0}}>
                  <Body style={{marginTop:5, marginLeft:0, paddingLeft:0}}>
                    <Text style={{fontSize:15, fontWeight:'normal', color:'#000000', marginLeft:0, marginBottom:2}} numberOfLines={1} ellipsizeMode='tail'>{item.boardName}</Text>
                    <View style={{justifyContent:'center', alignSelf:'flex-start', flexDirection:'row'}}>
                      {item.isSchedule && <Button transparent style={{
                        justifyContent: 'center',
                        paddingTop: 0,
                        paddingBottom: 0,
                        width: 65,
                        height: 25,
                        backgroundColor: '#ffffff',
                        borderColor: '#6D41DD',
                        borderWidth: 0.3,
                        borderRadius: 15,
                        marginRight: 10,
                      }} disabled>
                        <Text style={{
                          fontSize: 14,
                          color: '#6D41DD',
                          paddingLeft: 5,
                          paddingRight: 5,
                          fontWeight: 'normal'
                        }}>{moment(item.startDatetimeLong).format('MM / DD')}</Text>
                      </Button>
                      }
                      <Text style={{ width:'70%', marginTop:5, fontWeight:'normal', color:'#9a9a9a'}} numberOfLines={1} ellipsizeMode='tail'>{item.title}</Text>
                    </View>
                  </Body>
                  <Thumbnail small source={{uri: item.boardThumb}} />
                  </Left>
                </ListItem>

              )}
              keyExtractor={(item, index) => index + item.toString()}
            />
          </List>
        </Content>
      </Container>
    );
  }


};


export default NoticeList;
