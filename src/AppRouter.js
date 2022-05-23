import React, { Component } from 'react';
import {Route, Switch} from 'react-router-dom';
import Bisection from './Root of Equation/Bisection'

class AppRouter extends Component {
    render() {
        return(
            <div>
                <Switch>
                    <Route exact path="/bisection" component={Bisection} />
                </Switch>
            </div>
        );
    }
}
export default AppRouter;