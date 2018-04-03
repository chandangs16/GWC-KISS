/**
 * Arizona State University - Official Mobile App
 * https://www.asu.edu
 * @2017
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';
import {
  List,
  Calendar,
  Detail,
  Map,
  Status,
  Task,
  Advising,
  KissUniverse,
  GetQuestion,
  Authentication,
  Directory,
  Eadvisor,
  Events,
  Finance,
  Maps,
  News,
  Notifications,
  Schedule,
  Transportation,
}  from './components';

import {
  DrawerNavigator,
  StackNavigator,
  TabNavigator,
} from 'react-navigation';

import {
  NavUniversal,
  NavKiss
} from './navigation';

import {
  WebLogin
} from './components/functional/authentication/auth_components/weblogin';

// import {
//   asu,
//   colors,
// } from './themes/asu'



const TabNav = TabNavigator({
  Universal: { screen: NavUniversal }
},
{
  labelStyle: {
    fontSize: 16,
    color: '#FFF',
    backgroundColor: '#000'
  },
  style: {
    backgroundColor: '#000',
    paddingVertical: 10,
  },
  headerMode: 'none',
  tabBarPosition: 'bottom',
  tabBarOptions: {
    fontSize: 16,
    // activeTintColor: colors.maroon,
    // inactiveTintColor: colors.grey,
    // showIcon: 'true',
    // showLabel: (Platform.OS !== 'android'),
  },
})
export default class App extends Component {

  render() {
    console.disableYellowBox = true;
    return (
      <WebLogin appid="N2FtUnNrUXJ0S3pBb2tlZG1hdGg=" refresh="https://mcuwjen7gc.execute-api.us-west-2.amazonaws.com/prod/refresh">
        <NavUniversal screenProps={"Data"} />
      </WebLogin>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
