import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RadioButton from 'radio-button-react-native';
import { Button, ActivityIndicator, TouchableOpacity } from 'react-native';
//import SubmitButton from'react-native-submit-button';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default class GetQuestion extends Component<{}> {
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
    }; //this is how  you set up state
  }
  
  componentDidMount()
  {
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
            this.setState({question: data.question ,option1: data.option1 ,option2: data.option2 ,option3: data.option3,option4: data.option4, questionId: data.question_id, isLoading: false })
            //console.log("POST Response", "Response Body -> " + JSON.stringify(JSON.parse(responseData.body).input))
            }
        })
        .done();
        

  }
  render() {
   
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
        <Text style={styles.question}>
          {this.state.question}
        </Text>
        <RadioButton currentValue={this.state.value} style={styles.radioButton } value={1} onPress={this.OnAnswerSelect.bind(this)}>
          <Text style={styles.radioButton }>{this.state.option1}</Text>
        </RadioButton>
                      
        <RadioButton currentValue={this.state.value} value={2} style={styles.radioButton } onPress={this.OnAnswerSelect.bind(this)}>
          <Text style={styles.radioButton }>{this.state.option2}</Text>
        </RadioButton>
                 
        <RadioButton currentValue={this.state.value} value={3} style={styles.radioButton} onPress={this.OnAnswerSelect.bind(this)}>
          <Text style={styles.radioButton }>{this.state.option3}</Text>
        </RadioButton>

         <RadioButton currentValue={this.state.value} value={4}  style={styles.radioButton } onPress={this.OnAnswerSelect.bind(this)}>
          <Text style={styles.radioButton }>{this.state.option4}</Text>
        </RadioButton>
        <Text style={styles.message}>{this.state.optedAnswerMessage}</Text>
        <View style={{flexDirection: 'row'}}>
          
          <Button style={styles.buttons} onPress={this.submitAnswer.bind(this)} title="Submit" disabled={this.state.disableSubmit} color="#841584"/> 
          <Button style={styles.buttons} onPress={this.nextQuestion.bind(this)} title="Next" disabled={this.state.disableNext} color="#841584"/>
        </View>
      </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#FFFFFF',
  },
  question: {
    fontSize: 40,
    marginBottom:10,
  },
  radioButton: {
    fontSize: 20,
    marginBottom: 10,
    marginLeft:10,
  },
  message: {

    fontSize: 30,
    marginBottom: 10,
  },
  buttons:{
      padding:30,
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