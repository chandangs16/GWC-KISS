import React from 'react';
import { Scene, Router, Actions } from 'react-native-router-flux';
import GetQuestion from './components/GetQuestion';
import StudentHome from './components/StudentHome';
import StudentLogin from './components/StudentLogin';


const AppRouter = () => {
    return (
      <Router>
         {/* <Scene key="auth">
          <Scene key="studentLogin" component={StudentLogin} title="Please Login" />
        </Scene> */}
  
        <Scene key="main">
          <Scene
            key="studentHome"
            component={StudentHome}
            title="Welcome"
            initial
          />
        <Scene key="getQuestion" component={GetQuestion} title="Today's Question"  />
        </Scene>
      </Router>
    );
  };
  
  export default AppRouter;