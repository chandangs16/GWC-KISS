import React from 'react';
import { View, Text,AppRegistry, ScrollView } from 'react-native';
import { StackNavigator, DrawerNavigator, DrawerItems} from 'react-navigation';
import * as Components  from './components';

export const NavUniversal = StackNavigator({
  Home: {
    screen: Components.Universal,
  },
  Profile:{
    screen: Components.Profile,
  },
  KissUniverse: {
    screen: Components.KissUniverse,
  },
  LeaderBoard: {
    screen: Components.LeaderBoard
  }
});

const Drawer = DrawerNavigator({
  Profile:{
    screen: Components.Profile,
    navigationOptions:{
      title: "PROFILE"
    }
  }
},{
  contentComponent: {},
  initialRouteName: "Home",
  drawerPosition: "left",
  drawerBackgroundColor: "#2a2b30",
  contentOptions: {
    activeTintColor: '#555555',
    inactiveTintColor: 'white',
  },
  contentComponent: props =>
  <ScrollView>
    <DrawerItems
      {...props}
      getLabel = {(scene) => {
        return(
          <SingleDrawerItem label={props.getLabel(scene)} {...props} scene={scene} />
        )
      }}
    />
    <Logout  />
  </ScrollView>
});

AppRegistry.registerComponent('NavUniversal', () => Navigator);
AppRegistry.registerComponent('AppDrawer', () => Navigator);

class SingleDrawerItem extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    let chosenStyle = styles.drawerItem;
    if(this.props.scene.index+1 == this.props.items.length){
      chosenStyle = styles.drawerBottom;
    }
    if(this.props.label){
      if(typeof this.props.label == "string"){
        return (
          <View style={chosenStyle}>
            <Text style={styles.drawerText}>{this.props.label}</Text>
          </View>
        )
      } else {
        return (
          <View style={{width: "100%"}}>
           {this.props.label}
          </View>
        )
      }
    } else {
      return null
    }
  }
}
