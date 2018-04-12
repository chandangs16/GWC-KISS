import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,StyleSheet,TextInput,Button
} from 'react-native';
import {
  Api as ApiService,
} from '../services';
import {CardSection} from '../components/universal/kiss/common/index';

const styles = StyleSheet.create({
  container: {
      display: "flex",
      marginBottom: 20,
      borderBottomColor: "#e5e5e5",
      borderBottomWidth: 3,
      padding: 20
  },
  upperRow: {
      display: "flex",
      flexDirection: "row",
      marginBottom: 15
  },
  nameTag: {
      marginTop: 10,
      marginLeft: 20,
      marginRight: 5,
      fontWeight: "bold",
  },
  userName: {
      marginTop: 10,
      marginLeft: 5,
      marginRight: 20
  },
  seperator: {
      marginTop: 10,
  },
  scoreContainer: {
      display: "flex",
      borderTopColor: "#FAFAFA",
      borderTopWidth: 2,
      padding: 10,
      flexDirection: "row",
  },
  nickName: {
      color: "#00BFA5",
      fontWeight: "bold",
      marginLeft: 5
  }
});

const {
  container,
  upperRow,
  nameTag,
  userName,
  scoreContainer,
  seperator,
  nickName
} = styles;


export class Profile extends Component {

  constructor(props){
    super(props);
    this.state={
      tokens_Kiss:'',
      nick_name:'',
      text: 'Useless Placeholder'
    }
    this.getProfile=this.getProfile.bind(this);
  }

  async getProfile(){
    this.context.getTokens().then(response => {
      this.setState({ tokens_Kiss: response });
      console.log("Profile tokens:" + JSON.stringify(this.state.tokens_Kiss));
      let apiService = new ApiService("aws.com", this.state.tokens_Kiss);

      apiService.get("/prod/getprofile",{ "service": "", "region": "" }, {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      })

        .then(responseData => {
          var raw_data = JSON.parse(responseData.body);
          console.log("Get Profile:.")

          console.log(JSON.stringify(raw_data.message));
          this.setState({nick_name:raw_data.message.nickname});
        })
    }).catch(error => {
      console.error("Get Profile promise ", error);
      throw error;
    });
  }

  componentDidMount(){
    this.getProfile();
  }

  updateProfile(){
    console.log("update profile.");
      console.log("Profile tokens:" + JSON.stringify(this.state.tokens_Kiss));
      let apiService = new ApiService("aws.com", this.state.tokens_Kiss);

      apiService.post("/prod/updateprofile", {"nickname":this.state.nick_name},{ "service": "", "region": "" }, {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      })

        .then(responseData => {
          var raw_data = JSON.parse(responseData.body);
          console.log("Update Profile:.")

          console.log(JSON.stringify(raw_data.message));
          this.setState({nick_name:raw_data.message.nickname});

        }).catch(error => {
          console.error("Update Profile promise ", error);
          throw error;
        });


  }

  render () {
    return (
      <View style={container}>

        <View style={upperRow}>
          <Text style={nameTag}>ASURITE</Text>
          <Text style={seperator}>|</Text>
          <Text style={userName}>{this.state.tokens_Kiss.username}</Text>
        </View>

        <View style={scoreContainer}>

          <Text>NickName:

          </Text>
          <TextInput

            onChangeText={(nick_name) => this.setState({ nick_name })}
            value={this.state.nick_name}
          />
        </View>

        <CardSection style={styles.cardSectionStyle2}>
        <Button title="Update"  onPress={this.updateProfile.bind(this)}/>
      </CardSection>

      </View>
    );
  }
}

Profile.contextTypes = {
  logout: PropTypes.func,
  getTokens: PropTypes.func
}
