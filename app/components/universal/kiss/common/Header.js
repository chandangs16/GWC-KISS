// Import a Library to help create a component
import React from 'react';
import { Text, View } from 'react-native';

// Make a Component

const Header = (props) => {
  const { textStyle, viewStyle } = styles;
  return (
    <View style={viewStyle}>
    <Text style={textStyle} >{props.headerText}</Text>
    </View>
);
};

const styles = {
  viewStyle: {
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    paddingTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: 'relative'
  },
  textStyle: {
    fontSize: 20
  }
};
// Make Component available to other parts of the App
//export default Header;

export {Header};
