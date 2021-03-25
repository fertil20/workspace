/*
import React from 'react';
//import logo from './logo.svg';
import './App.css';
import UserComponent from './components/UserComponent';

function App() {
    return (
        <div className="App">
            <UserComponent />
        </div>
    );
}

export default App;*/


import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
//import GroupEdit from './GroupEdit';
import { CookiesProvider } from 'react-cookie';
import UserComponent from "./components/UserComponent";
import Form from './Form';

class App extends Component {
    render() {
        return (
            <CookiesProvider>
                <Router>
                    <Switch>
                        <Route path='/home' exact={true} component={Home}/>
                        <Route path='/' exact={true} component={Form}/>
                        <Route path='/login' exact={true} component={Form}/>
                        <Route path='/users' exact={true} component={UserComponent}/>
                        {/*<Route path='/users/:id' component={UserEdit}/>*/}
                    </Switch>
                </Router>
            </CookiesProvider>

        )
    }
}


export default App;
