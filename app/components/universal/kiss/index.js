
import React , {Component} from 'react';
import PropTypes from 'prop-types';
import RadioButton from 'radio-button-react-native';
import Katex from 'react-native-katex';
//import SubmitButton from'react-native-submit-button';
import {
  Button,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {Confirm,CardSection} from './common/index'
import {
  Api as ApiService,
} from '../../../services';

var DeviceInfo = require('react-native-device-info');
import LeaderBoard from './LeaderBoard';
export class KissUniverse extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
      });
  constructor(props) {
    super(props);
    this.state = {
      question: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      optedAnswer: 0,
      value: 0,
      disableSubmit: true,
      questionId: 0,
      disableNext: true,
      isAnswerCorrect: 0,
      optedAnswerMessage: '',
      isLoading: true,
      areQuestionsComplete: false,
      QuestionsCompleteMsg:'',
      showModal: false,
      tokens_Kiss:'',
      asurite:'',
      token_push:'',
      token_write: false,
      course:''
    }; //this is how  you set up state
    //this.checkPushNotifications = this.checkPushNotifications.bind(this);
  }


  componentDidMount() {
    this.setState({ showModal: false });
    this.fetchQuestion();
  }

  nextQuestion() {
    this.setState({ isLoading: true, disableSubmit: true, disableNext: true, optedAnswerMessage: '', value: 0 })
    this.fetchQuestion();
  }

  OnAnswerSelect(value) {
    this.setState({ optedAnswer: value, value: value, disableSubmit: false })
  }

  fetchCharityCredits(){

    this.context.getTokens().then(response => {
      this.setState({ tokens_Kiss: response});
      console.log("charity request for  ", this.props.navigation.state.params.data);
      let apiService = new ApiService("amazonaws.com", this.state.tokens_Kiss);
      console.log("request sent for checking charity");
      apiService.post("/prod/getcharity", {
        "subject_code": this.props.navigation.state.params.data,
      }, { "service": "", "region": "" }, {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }).then(responseData => {

          var raw_data = JSON.parse(responseData.body);

          var data = raw_data.message;
          var status = raw_data.success;
          console.log("raw data:"+raw_data);
          console.log("resp data:"+responseData);


          if(status == 0)
          {

            var c_label = [];
            var c_id = [];
            var c_final = [];

            var options = data.toString().split(",");

            for(var i = 0; i < options.length; i++)
            {
                if(i % 2 != 0)
                {
                  c_label.push(options[i])
                }
                else
                {
                  c_id.push(options[i])
                }
            }
            for (var i = 0; i < options.length/2; i++)
            {
              c_final.push({"label": c_label[i], "value": parseInt(c_id[i])})
            }

            this.setState(({isCharityLoading:false, charityList:c_final, isLoading: false}));
            console.log(" List ", this.state.charityList);
          }

          else
          {
            console.log("else part")
             this.setState(({isCharityPresent:false}));
             this.fetchQuestion();
          }

          //this.setState({ optedAnswerMessage: data.message, disableNext: disableNext, isAnswerCorrect: isAnswerCorrect, isLoading: false })
        }).catch(error => {
          console.error(error);
          throw error;
        });
    }).catch(error => {
      console.error("GetQustion promis ", error);
      throw error;
    });
  }

  onCharityAccept() {
    console.log("DBGG @1");
    // this.context.getTokens().then(response => {

    //   this.setState({ tokens_Kiss: response, course:this.props.navigation.state.params.data });
    //   console.log("Submit Charity for course ", this.props.navigation.state.params.data);
    //   console.log("charity id is:"+this.state.charity_id);
    //   let apiService = new ApiService("amazonaws.com", this.state.tokens_Kiss);
    //   apiService.post("/prod/submitcharity", { "subject_code": this.props.navigation.state.params.data,"charity_id":this.state.charity_id }, { "service": "", "region": "" }, {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json',
    //   })
    //     .then(responseData => {
    //       console.log(responseData);
    //       var raw_data = JSON.parse(responseData.body);
    //       console.log(JSON.stringify(raw_data));
    //       var data = raw_data.message;
    //       console.log("Message from submit charity", data);
    //     })
    //     .catch(error => {
    //       console.error(error);
    //       throw error;
    //     });
    // }).catch(error => {
    //   console.error("Submit charity ", error);
    //   throw error;
    // });


    this.fetchQuestion();
   //this.setState({ showConfirm: false , isCharityPresent:false, showModal:false});

  }

  onCharityDecline() {
    this.setState({ showConfirm: false });
  }


  submitAnswer() {
    this.setState({ isLoading: true, disableSubmit: true });
    this.state.tokens_Kiss = this.context.getTokens();
    let apiService = new ApiService("amazonaws.com/prod", this.state.tokens_Kiss);
    console.log("subject code chandan:" + this.props.navigation.state.params.data);
    apiService.post("/dev/checkanswer", {
      "subject_code": this.props.navigation.state.params.data,
      "answer": this.state.value,
      "question_id": this.state.questionId
    }, { "service": "", "region": "" }, {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      })
      .then(responseData => {

        var raw_data = JSON.parse(responseData.body);
        var data = raw_data.message;
        console.log("request sent for check answer")
        console.log(data);
        console.log(JSON.stringify(data));
        var correct = data.correct;
        var isAnswerCorrect = 0;
        var disableNext = true;
        if (correct == 1) {
          isAnswerCorrect = 1;
          disableNext = false;
        }

        this.setState({ optedAnswerMessage: data.message, disableNext: disableNext, isAnswerCorrect: isAnswerCorrect, isLoading: false })
      }).catch(error => {
        console.error(error);
        throw error;
      });
  }

  fetchQuestion() {
    this.state.tokens_Kiss = this.context.getTokens();
    this.context.getTokens().then(response => {
      //console.log("GetTokens() ", response);
      this.setState({ tokens_Kiss: response, course:this.props.navigation.state.params.data });
      console.log("Fetch Question for course ", this.props.navigation.state.params.data);
      let apiService = new ApiService("amazonaws.com", this.state.tokens_Kiss);
      apiService.post("/prod/getquestion", { "subject_code": this.props.navigation.state.params.data }, { "service": "", "region": "" }, {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      })
        .then(responseData => {
          console.log(responseData);
          var raw_data = JSON.parse(responseData.body);
          console.log("Hiiii ", raw_data);
          console.log("request sent")
          console.log(JSON.stringify(raw_data));
          var data = raw_data.message;
          console.log("Message ", data);
          var disableNext = true;
          var isAnswerCorrect = true;
          if (data.question == null) {
            this.setState({ areQuestionsComplete: true, QuestionsCompleteMsg: data, isLoading: false })
          }
          else {
            var questionString = data.question;
            questionString = questionString.replace(/[$]{0,}[$$]{0,}/gi, '');
            console.log("Question received ", questionString);

            var option1String = data.option1;
            option1String = option1String.replace(/[$]{0,}[$$]{0,}/gi, '');

            var option2String = data.option2;
            option2String = option2String.replace(/[$]{0,}[$$]{0,}/gi, '');

            var option3String = data.option3;
            option3String = option3String.replace(/[$]{0,}[$$]{0,}/gi, '');

            var option4String = data.option4;
            option4String = option4String.replace(/[$]{0,}[$$]{0,}/gi, '');


            this.setState({ question: questionString, option1: option1String, option2: option2String, option3: option3String, option4: option4String, questionId: data.question_id, isLoading: false })
          }
          this.setState({ optedAnswerMessage: data.message, disableNext: disableNext, isAnswerCorrect: isAnswerCorrect, isLoading: false })
        })
        .catch(error => {
          console.error(error);
          throw error;
        });
    }).catch(error => {
      console.error("GetQustion promis ", error);
      throw error;
    });
  }

  onAccept() {
    let apiService = new ApiService("amazonaws.com", this.state.tokens_Kiss);
    console.log("subject code chandan:" + this.props.navigation.state.params.data);
    console.log("question id" + this.state.questionId);
    apiService.post("/prod/checkanswer", {
      "subject_code": this.props.navigation.state.params.data,
      "answer": this.state.value,
      "question_id": this.state.questionId
    }, { "service": "", "region": "" }, {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    })
      .then(responseData => {
        console.log(responseData)
        var raw_data = JSON.parse(responseData.body);
        console.log("here" + raw_data)
        var data = raw_data.message;
        console.log("request sent check answer")
        console.log(raw_data)
        console.log(JSON.stringify(data));
        var correct = data.correct;
        var isAnswerCorrect = 0;
        var disableNext = true;
        if (correct == 1) {
          isAnswerCorrect = 1;
          disableNext = false;
        }
        this.setState({ optedAnswerMessage: data.message, disableNext: disableNext, isAnswerCorrect: isAnswerCorrect, isLoading: false })
      })
      .catch(error => {
        console.error(error);
        throw error;
      });
    this.setState({ showModal: false });
  }

  onDecline() {
    this.setState({ showModal: false });
  }


  render() {
    const { navigate } = this.props.navigation;
    console.log(JSON.stringify(this.props));

    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }

    if (this.state.areQuestionsComplete) {
      return (
        <View>
          <Text style={styles.info}>
            {this.state.QuestionsCompleteMsg}
          </Text>
        </View>
      )
  }
  return (
    <View style={styles.container}>
      {/* <Text style={styles.question}>
        {this.state.question}
      </Text> */}
      <Katex
        expression={this.state.question}
        style={styles.katex}
        inlineStyle={inlineStyle}
        displayMode={false}
        throwOnError={false}
        errorColor="#f00"
        macros={{}}
        colorIsTextColor={false}
        onLoad={()=> this.setState({ loaded: true })}
        onError={() => console.error('Error')}
        />
        <View style={{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'stretch',
    }}>

      <RadioButton currentValue={this.state.value} style={styles.radioButton } value={1} onPress={this.OnAnswerSelect.bind(this)}>
        <Katex  style={styles.katex} expression={this.state.option1} inlineStyle={optionStyle}  />
      </RadioButton>



      <RadioButton currentValue={this.state.value} value={2}  onPress={this.OnAnswerSelect.bind(this)}>
        <Katex  style={styles.katex} expression={this.state.option2} inlineStyle={optionStyle} />
      </RadioButton>


      <RadioButton currentValue={this.state.value} value={3} style={styles.radioButton} onPress={this.OnAnswerSelect.bind(this)}>
        <Katex  style={styles.katex} expression={this.state.option3} inlineStyle={optionStyle} />
      </RadioButton>

      <RadioButton currentValue={this.state.value} value={4}  style={styles.radioButton } onPress={this.OnAnswerSelect.bind(this)}>
        <Katex  style={styles.katex} expression={this.state.option4}inlineStyle={optionStyle} />
      </RadioButton>

      </View>
      <Text style={styles.message}>{this.state.optedAnswerMessage}</Text>
      <View>
      <CardSection style={styles.cardSectionStyle}>
        <Button title="Submit" onPress={() => this.setState({showModal: !this.state.showModal})} disabled={this.state.disableSubmit}/>
        <Button title="Next" onPress={this.nextQuestion.bind(this)}  disabled={this.state.disableNext}/>
      </CardSection>
      </View>

      <CardSection style={styles.cardSectionStyle2}>
        <Button  title="LeaderBoard" onPress={() => navigate("LeaderBoard", {data: this.state.course})}/>
      </CardSection>

      <Confirm
        visible={this.state.showModal}
        onAccept={this.onAccept.bind(this)}
        onDecline={this.onDecline.bind(this)}
      >
        Submit Answer?
      </Confirm>
    </View>
  );
}

}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
    fontSize: 5,
    marginBottom: 20,
    marginLeft: 10,
    height: 40,
    backgroundColor: 'yellow'
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

KissUniverse.contextTypes = {
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

const optionStyle =`
html, body {
  display: flex;
  background-color: #FFFFFF;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  margin: 10;
  padding: 10;
}
.katex {
  font-size: 0.63em;
  margin: 10;
  display: flex;
}
`;
