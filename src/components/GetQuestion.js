
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RadioButton from 'radio-button-react-native';
import Katex from 'react-native-katex';
import { Button, ActivityIndicator, TouchableOpacity } from 'react-native';
//import SubmitButton from'react-native-submit-button';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView
} from 'react-native';
import {Confirm,CardSection} from './common/index'
import { Actions } from 'react-native-router-flux';

class GetQuestion extends Component {
  
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
      showModal: false
    }; //this is how  you set up state
  }

  
  componentDidMount()
  {
    console.log(this.props);
    this.setState({showModal:false});
    this.fetchQuestion();
  }
  

  nextQuestion(){
    this.setState({isLoading:true, disableSubmit: true, disableNext:true, optedAnswerMessage:'', value: 0})
    this.fetchQuestion();
  }
  
  OnAnswerSelect(value){
    this.setState({optedAnswer:value,value:value,disableSubmit:false})
  }

  submitAnswer(){
      this.setState({isLoading:true, disableSubmit: true});
      fetch('https://zaytz4lse8.execute-api.us-east-1.amazonaws.com/dev/checkanswer', {  
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subject_code: 'CSE500',
            answer: this.state.value,
            question_id: this.state.questionId
          })
        })

        .then((response) => response.json())
        .then((responseData) => {
            var data=JSON.parse(responseData.body).input;
            console.log("requwst sent")
            console.log(JSON.stringify(data));
            var correct=data.correct;
            var isAnswerCorrect=0;
            var disableNext=true;
            if(correct==1)
            { 
              isAnswerCorrect=1;
              disableNext=false;
            }

            this.setState({optedAnswerMessage: data.message,disableNext:disableNext,isAnswerCorrect: isAnswerCorrect,isLoading:false})
        })
        .catch((error) => {
        console.error(error);
        });
        

  }
  fetchQuestion() {

        fetch('https://zaytz4lse8.execute-api.us-east-1.amazonaws.com/prod/getquestion', {  
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subject_code: 'CSE500',
          })
        })

        .then((response) => response.json())
        .then((responseData) => {
            var data=JSON.parse(responseData.body).input;
            console.log(JSON.stringify(data));
            if(data.question==null)
            { 
              this.setState({areQuestionsComplete:true, QuestionsCompleteMsg: data,isLoading:false})
              //console.log("&&&&&&&&&&L******"+data)
            }
            else
            {

              var questionString = data.question;
              questionString = questionString.replace(/[$]{0,}[$$]{0,}/gi,'');

            this.setState({question: questionString ,option1: data.option1 ,option2: data.option2 ,option3: data.option3,option4: data.option4, questionId: data.question_id, isLoading: false })
            //console.log("POST Response", "Response Body -> " + JSON.stringify(JSON.parse(responseData.body).input))
            }
        })
        .done();
        

  }

  onAccept() {
    this.setState({isLoading:true, disableSubmit: true});
      fetch('https://zaytz4lse8.execute-api.us-east-1.amazonaws.com/dev/checkanswer', {  
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subject_code: 'CSE500',
            answer: this.state.value,
            question_id: this.state.questionId
          })
        })

        .then((response) => response.json())
        .then((responseData) => {
            var data=JSON.parse(responseData.body).input;
            console.log("request sent")
            console.log(JSON.stringify(data));
            var correct=data.correct;
            var isAnswerCorrect=0;
            var disableNext=true;
            if(correct==1)
            { 
              isAnswerCorrect=1;
              disableNext=false;
            }

            this.setState({optedAnswerMessage: data.message,disableNext:disableNext,isAnswerCorrect: isAnswerCorrect,isLoading:false})
        })
        .catch((error) => {
        console.error(error);
        });
    this.setState({showModal: false});
}

  onDecline() {
    this.setState({showModal: false});
}
  render() {

    console.log(this.props);
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }
    
    if(this.state.areQuestionsComplete)
    {
       return (
                <View style={styles.container}>
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
          

          <RadioButton currentValue={this.state.value} style={styles.radioButton } value={1} onPress={this.OnAnswerSelect.bind(this)}>
          <Katex  style={styles.katex} expression={this.state.question} />
        </RadioButton>
                      
        <RadioButton currentValue={this.state.value} value={2} style={styles.radioButton } onPress={this.OnAnswerSelect.bind(this)}>
          <Katex  style={styles.katex} expression={this.state.option2} />
        </RadioButton>
                 
        <RadioButton currentValue={this.state.value} value={3} style={styles.radioButton} onPress={this.OnAnswerSelect.bind(this)}>
          {/* <Text style={styles.radioButton }>{this.state.option3}</Text> */}
          <Katex  style={styles.katex} expression={this.state.option3} />
        </RadioButton>

         <RadioButton currentValue={this.state.value} value={4}  style={styles.radioButton } onPress={this.OnAnswerSelect.bind(this)}>
          {/* <Text style={styles.radioButton }>{this.state.option4}</Text> */}
          <Katex  style={styles.katex} expression={this.state.option4} />
        </RadioButton>
        <Text style={styles.message}>{this.state.optedAnswerMessage}</Text>
        {/* <View style={{flexDirection: 'row'}}>
          
          <Button style={styles.buttons} onPress={this.submitAnswer.bind(this)} title="Submit" disabled={this.state.disableSubmit} color="#841584"/> 
          <Button style={styles.buttons} onPress={this.nextQuestion.bind(this)} title="Next" disabled={this.state.disableNext} color="#841584"/>
        </View> */}
        <View>
        <CardSection style={styles.cardSectionStyle}>
          {/* <View style={styles.thumbnailContainerStyle}> */}
          <Button title="Submit" onPress={() => this.setState({showModal: !this.state.showModal})} disabled={this.state.disableSubmit}/>
          {/* </View> */}
          {/* <View style={styles.headerContentStyle}> */}
          <Button title="Next" onPress={this.nextQuestion.bind(this)}  disabled={this.state.disableNext}/>
          {/* </View> */}
        </CardSection>
        </View>

        <CardSection style={styles.cardSectionStyle2}>
          <Button  title="Go Back" onPress={() => Actions.studentHome()}/>
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

export default GetQuestion;