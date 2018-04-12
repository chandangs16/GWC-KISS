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
  ListView,
  Animated,
  Easing,
  Platform,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableHighlight,
  FlatList,
  StyleSheet,
} from 'react-native';

import PropTypes from 'prop-types';
import {
  Api as ApiService,
} from '../services';

import * as Component from './';
import {
  asu,
  actions,
  palette,
} from '../themes/asu'

import {
  WebLogin
} from './functional/authentication/auth_components/weblogin';

import {
  Logout
} from './functional/authentication/auth_components/logout';

var DeviceInfo = require('react-native-device-info');
import {Confirm,CardSection} from './universal/kiss/common/index'
var { height, width } = Dimensions.get('window');
var ds= new ListView.DataSource({rowHasChanged:(r1,r2)=>r1!==r2});


export class Universal extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: "Today's Question",
    headerTintColor: "#000",
    headerStyle: {
      backgroundColor: palette.gold
    }
  });
  constructor(props) {
    super(props);
    this.state = {
      component: 'Home',
      count: Component.length,
      tokens_Kiss:'',
      courseList:null
    };
    this.getCourses=this.getCourses.bind(this);
  }

  async getCourses(){
    this.context.getTokens().then(response => {
      this.setState({ tokens_Kiss: response });
      console.log("tokens:" + JSON.stringify(this.state.tokens_Kiss));

      let apiService = new ApiService("amazon.com", this.state.tokens_Kiss);

      apiService.get("/prod/getcourses", { "service": "", "region": "" }, {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      })
        .then(responseData => {
          var raw_data = JSON.parse(responseData.body);
          console.log("Get list of courses.")
          console.log(raw_data);
          console.log(JSON.stringify(raw_data.message));
          this.setState({courseList:raw_data.message});
        })
    }).catch(error => {
      console.error("GetQustion promis ", error);
      throw error;
    });
  }



  componentDidMount() {
    const { navigate } = this.props.navigation;
    console.log("component mounted");
    this.getCourses();

    var PushNotification = require('react-native-push-notification');
    console.log(this.props);
    this.context.getTokens().then(response => {
      console.log("GetTokens() ", response);
      console.log("ASURE ", response.username);
      this.setState({ asurite: response.username });
      console.log("ASURITE ID ", this.state.asurite)
      console.log("Platform " , Platform.OS)
      var perms = false;

      if (Platform.OS != 'ios') {
        perms = true;
      }

      PushNotification.configure({

        senderID: "109449617711",
        onRegister: function (token) {
          console.log("onRegister token received: ", token);
          //console.log("ASURITE ID ", this.state.asurite)
          fetch('/prod/tokenpref', {
            method: 'POST',
            body: JSON.stringify({
              operation: "writeToken",
              appId: "",
              id: DeviceInfo.getUniqueID(),
              token: token.token,
              platform: Platform.OS,
              asurite: this.state.asurite,
            })
          })
            .then((response) => {


              if (response.status == 200) {
                this.setState({ token_write: true });
                //this.checkPushNotifications();
                console.log("Push Notif Token sent to the server Success");
              }
              else {
                console.log("Push Notif Token sent to the server Failed");
              }
            })
            .then((responseData) => {
              //console.log("Write Token Response Data ", responseData);
            })
        }.bind(this),

        onNotification: function (notification) {


          console.log("Notification received", notification);
          //saveDeviceInfo
          if (notification.userInteraction == true) {

            var pId = "";

            if (Platform.OS == 'ios') {
              pId = notification.data.pushId;
            } else {
              pId = notification.pushId;
            }

            fetch('/prod/openedpush', {
              method: 'POST',
              body: JSON.stringify({
                operation: "openedNotification",
                pushId: pId,
                deviceId: DeviceInfo.getUniqueID(),
                //hardcoding asurite. TODO: Fetch the right ASURITE from state
                asurite: "amudumba",
                timeOpened: new Date()
              })
            })
          }


          //User clicked on the notification. Navigate to the Kiss questions (Kiss Universe ) page
          if(Platform.OS == 'ios')
          {
            navigate("KissUniverse", { data: notification.data.message });
          }
          else if(Platform.OS == 'android')
          {
            navigate("KissUniverse", { data: notification.message });
          }

        },
        permissions: {
          alert: true,
          badge: true,
          sound: true
        },
        popInitialNotification: true,
        requestPermissions: perms,
        onError: function (err) {
          console.log(err);
        }
      });

      var requestPromise = null;

      function requestPerms() {
        if (requestPromise) {
          console.log(" @1 RESPONSE", requestPromise);
          return requestPromise;
        }

        else {
          requestPromise = PushNotification.requestPermissions("8687798978").then(res => {
            console.log(" @2RESPONSE", res);
            requestPromise = null;
            return res;
          }, err => {
            requestPromise = null;
          });
          return requestPromise;
        }

      }

      // Doing the actual request
      if (Platform.OS == 'ios') {
        requestPerms().then(res => {
          if (!res.alert) {
            // They picked deny :(
          } else {
            console.log("In promise return", res);
          }
        });
      } else {
        PushNotification.requestPermissions("109449617711");
      }

    });
  }


  renderCourses = (course)=>{

    const { navigate } = this.props.navigation;

        console.log("course is :"+course);
        return(

          <CardSection>
              <Button onPress={() => navigate("KissUniverse", { data: course })} title={""+course+""}>

                    </Button>
            </CardSection>
        )


  }

  emptyCourses(){
    if(!this.state.courseList)
    return <Text>No courses Registered</Text>
  }

  render() {
    const { navigate } = this.props.navigation;
    const { headerContentStyle, labelStyle, containerStyle } = styles;
    console.log(this.state.courseList);
    return (
      <ScrollView style={styles.container}>

        {/* <TouchableHighlight underlayColor={actions.backgroundClick} style={styles.item} onPress={() => navigate("KissUniverse", { data: "Data" })} > */}
          <View>
            <CardSection >
              <Text style={labelStyle}> Hello Math Student. </Text>
            </CardSection>

            <CardSection >
              <Text style={labelStyle}> Your present score is: </Text>
            </CardSection>
            {this.state.courseList && <ListView
              dataSource={ds.cloneWithRows(this.state.courseList)}
            renderRow={this.renderCourses} />}
            {this.emptyCourses}

          </View>

          <CardSection>
          <Button onPress={() => navigate("Profile", { data: "Data" })} title={"Profile"}>
          </Button>
        </CardSection>
        <Logout />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  katex: {
    flex: 1,
  },
  question: {
    fontSize: 40,
    marginBottom:10,
  },
  radioButton: {
    fontSize: 20,
    marginBottom: 10,
    marginLeft: 10
  },
  thumbnailContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 200
  },
  headerContentStyle: {
    flexDirection: 'column',
    justifyContent: 'space-around'
},
cardSectionStyle: {
  justifyContent: 'space-around',
},
cardSectionStyle2: {
  margin: 20,
  justifyContent: 'center',
},
  message: {

    fontSize: 30,
    marginBottom: 10,
  },
  buttons:{
      padding:20,
       borderRadius:5,
       marginBottom: 20,
  },
  info:{
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: 'green',

  }
});

Universal.contextTypes = {
  logout: PropTypes.func,
  getTokens: PropTypes.func
}
const inlineStyle =`
html, body {
  display: flex;
  background-color: #FFFFFF;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin: 0;
  padding: 0;
}
.katex {
  font-size: 1.3em;
  margin: 0;
  display: flex;
}
`;
