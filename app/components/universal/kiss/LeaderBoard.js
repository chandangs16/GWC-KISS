import React , {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    Platform,
    StyleSheet,
    ListView,
    Text,
    View,
    palette
  } from 'react-native';
  import {
    Api as ApiService,
  } from '../../../services';
  import ScoreCard from './common/ScoreCard';
  import {CardSection} from './common/index'

  var ds= new ListView.DataSource({rowHasChanged:(r1,r2)=>r1!==r2});

  export class LeaderBoard extends Component{
    static navigationOptions = ({ navigation, screenProps }) => ({
        title: "",
        headerTintColor: "#000",
        headerStyle: {
          backgroundColor: 'green'
        }
      });

      constructor(props) {
        super(props);
        this.state = {
          component: 'LeaderBoard',
          count: Component.length,
          tokens_Kiss:'',
          course:'',
          leaderBoard:null
        };
        this.getLeaderBoard=this.getLeaderBoard.bind(this);
      }

      async getLeaderBoard(){
        this.context.getTokens().then(response => {
          this.setState({ tokens_Kiss: response });
          console.log("L Board parameters " + this.props.navigation.state.params.data)
          console.log("Leaderboard tokens:" + JSON.stringify(this.state.tokens_Kiss));
    
          let apiService = new ApiService("amazonaws.com", this.state.tokens_Kiss);
    
          apiService.post("/prod/leaderboard", { "subject_code": this.props.navigation.state.params.data }, { "service": "", "region": "" }, {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          })

            .then(responseData => {
              var raw_data = JSON.parse(responseData.body);
              console.log("Get leaderboard:.")
              console.log(raw_data);
              console.log(JSON.stringify(raw_data.message));
              
              this.setState({leaderBoard:raw_data.message})
              if(raw_data.success=="1")this.setState({leaderBoard:null})  
            })
        }).catch(error => {
          console.error("Get Leaderboard promise ", error);
          throw error;
        });
      }

      componentDidMount(){
        const { navigate } = this.props.navigation;
          this.getLeaderBoard();
      }

      renderLeaderBoard=(score) => {
        console.log("course is :"+score);
        return (

          <ScoreCard
            nick_name={score[0]}
            score={score[1]}
            rank={score[2]}
          />
        )
      }

      emptyLeaderboard(){
        if(this.state.leaderBoard==null){
            console.log("empty leaderboard:"+this.state.leaderBoard)
            return <Text>No Scores List</Text>
        }
        
      }

    render(){
        return(
            <View>
            {this.state.leaderBoard && <ListView
              
              dataSource={ds.cloneWithRows(this.state.leaderBoard)}
            renderRow={this.renderLeaderBoard} />}
            
            {this.emptyLeaderboard}
            </View>
        )
    }
  }

  LeaderBoard.contextTypes = {
    logout: PropTypes.func,
    getTokens: PropTypes.func
  }


  //export default Leaderboard;