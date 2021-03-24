import React, { Component } from 'react';
import './App.css';
import Home from './components/Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import UserList from './components/UserList';
import GroupEdit from './components/UserEdit';
import { CookiesProvider } from 'react-cookie';

class App extends Component {
  render() {
    return (
        <CookiesProvider>
        <Router>
          <Switch>
            <Route path='/' exact={true} component={Home}/>
            <Route path='/users' exact={true} component={UserList}/>
              <Route path='/users/:id' component={GroupEdit}/>
          </Switch>
        </Router>
        </CookiesProvider>

    )
  }
}


export default App;
