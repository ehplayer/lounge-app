import React from 'react';
import PropTypes from 'prop-types';
import { Container, Content, Text, Body} from 'native-base';

const Error = ({ title, content }) => (
  <Container>
    <Content>
      <Body style={{justifyContent:'center'}}>
        <Text note style={{marginTop:80, fontSize:22}}>{content}</Text>
      </Body>
    </Content>
  </Container>
);

Error.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
};
Error.defaultProps = {
  title: 'Uh oh',
  content: '가입한 클럽이 없습니다.',
};

export default Error;
