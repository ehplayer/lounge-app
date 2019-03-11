import React from 'react';
import PropTypes from 'prop-types';
import {Dimensions, Image} from 'react-native';
import {Container, Content, List} from 'native-base';
import AuthWaitingImage from "../../images/authWaiting.png";

class AuthWating extends React.Component {
  static propTypes = {
    member: PropTypes.shape({}),
  };
  
  static defaultProps = {
    member: {},
  };

  render(){
    return (
      <Container>
              <Image
                  style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height, margin:0, padding:0}}
                  resizeMode="cover"
                  source={AuthWaitingImage}/>
      </Container>
    )
  }
}




export default AuthWating;
