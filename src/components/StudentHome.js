import React, {Component} from 'react';

import {View, Text } from 'react-native';


import { CardSection,Button } from './common/index';
import { Actions } from 'react-native-router-flux';

class StudentHome extends Component {
    static navigationOptions = {
        title: "Welcome"
    }

    getQuestions() {
        Actions.getQuestion();
    }

    render() {
        const { navigate } = this.props.navigation;
        console.log(this.props);
        const {headerContentStyle, labelStyle, containerStyle} = styles;
        return (
            <View>
            <CardSection >
                <Text style={labelStyle}> Hello Chandan. </Text>
            </CardSection>

            <CardSection >
                <Text style={labelStyle}> Your present score is: </Text>
            </CardSection>
            <CardSection>
             <Button onPress={this.getQuestions.bind(this)}>
             Answer Today's Question
             </Button>
         </CardSection>

            </View>
        );
    }
}


const styles = {
    inputStyle: {
        color: '#000',
        paddingRight: 5,
        paddingLeft: 5,
        fontSize: 18,
        lineHeight: 23,
        flex:2
    },
    headerContentStyle: {
        flexDirection: 'column',
        justifyContent: 'space-around'
    },
    labelStyle: {
        fontSize: 18,
        paddingLeft: 20,
        flex: 1
    },
    containerStyle: {
        height: 40,
        flex: 1,
        flexDirection: 'row',
        //alignItems: 'center'
    }
}

export default StudentHome;