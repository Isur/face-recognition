import React from 'react';
import { Route, Switch } from 'react-router-dom';
// Components
import Home from './Home';
import NotFound from './NotFound';
import Analyze from './Analyze';
import Identify from './Identify';
// import Analyze from './Analyze';
const Router = (props) => {
    console.log(props.id);
    return(
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/home" component={Home} />
            <Route exact path="/analyze" component={Analyze} />
            <Route exact path="/identify" component={Identify} />
            <Route component={NotFound} />
        </Switch>
    );
}

export default Router;