import React from 'react';
import {
  View,
  Image,
  Dimensions,
  Keyboard,
  Text,
  AsyncStorage,
  TextInput,
  Button,
  Animated,
  Easing,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableHighlight,
  FlatList,
  StyleSheet,
} from 'react-native';

import * as Component from './';


var { height, width } = Dimensions.get('window');

const tabNav = TabNavigator({
  TabItem1: {
      screen: stackNav,
      navigationOptions: {
          tabBarLabel:"Tab 1",
          tabBarIcon: ({ tintColor }) => <Icon name={"glass"} size={30} color={tintColor} />
      }
  }

  ///... add more tabs here

}, {
      tabBarOptions: {
          activeTintColor: '#222',
      }
});

export default tabNav;