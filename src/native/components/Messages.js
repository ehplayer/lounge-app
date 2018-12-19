import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text } from 'native-base';

const Messages = ({ message, type }) => (
  <View style={{
      paddingVertical: 10,
      paddingHorizontal: 5,
    }}
  >
    <Text style={{ color: '#007aff', textAlign: 'center',fontWeight:'800', fontSize:17}}>{message}</Text>
  </View>
);

Messages.propTypes = {
  message: PropTypes.string,
  type: PropTypes.oneOf(['error', 'success', 'info']),
};

Messages.defaultProps = {
  message: 'An unexpected error came up',
  type: 'error',
};

export default Messages;
