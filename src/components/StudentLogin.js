import React, { Component} from 'react';
import {View, Text} from 'react-native';
import {Card, CardSection, Input, Button} from './common';

class StudentLogin extends Component {

    render() {
        return (
            <Card>
                <CardSection>
                    <Input
                        label="Email"
                        placeholder="email@abc.com"
                        value={this.props.email}
                    />
                </CardSection>

                <CardSection>
                    <Input
                        secureTextEntry
                        label="Password"
                        placeholder="password"
                        value={this.props.password}
                    />
                </CardSection>

                {this.renderError()}
                <CardSection>
                    <Button>
                        Login
                    </Button>
                </CardSection>
            </Card>
        );
    } 
}


const styles = {
    errorTextStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    }
}



export default StudentLogin;