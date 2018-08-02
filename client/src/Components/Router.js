import React from 'react';
import { Route, Switch } from 'react-router-dom';
// Components
import Home from './Home';
import NotFound from './NotFound';
import Analyze from './Analyze';
import Identify from './Identify';
import AddFace from './AddFace';
import AddPerson from './AddPerson';
import AddPersonGroup from './AddPersonGroup';
import Show from './Show';
const Router = (props) => {
    console.log(props.id);
    return(
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/home" component={Home} />
            <Route exact path="/analyze" component={Analyze} />
            <Route exact path="/identify" component={Identify} />
            <Route exact path="/addperson" component={AddPerson} />
            <Route exact path="/addface" component={AddFace} />
            <Route exact path="/addpersongroup" component={AddPersonGroup} />
            <Route exact path="/show" component={Show} />
            <Route component={NotFound} />
        </Switch>
    );
}

export default Router;