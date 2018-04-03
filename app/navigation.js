import React from 'react';
import { View, Text,AppRegistry } from 'react-native';
import { StackNavigator } from 'react-navigation';
import * as Components  from './components';

export const NavUniversal = StackNavigator({
  Home: {
    screen: Components.Universal,
  },
  KissUniverse: {
    screen: Components.KissUniverse,
  },
  LeaderBoard: {
    screen: Components.LeaderBoard
  }
});

AppRegistry.registerComponent('NavUniversal', () => Navigator);