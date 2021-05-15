import React, {Component} from 'react';
import {getUsersBirthday} from "../../util/APIUtils";
import NotFound from "../../common/NotFound";
import ServerError from "../../common/ServerError";
import {Row, Col} from 'reactstrap';
import "./BirthdayPage.css";
import {Link} from "react-router-dom";

import NavigationPanel from "../navigation/NavigationPanel";
import {formatDate, formatDateDayMonth} from "../../util/Helpers";

class BirthdayPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            CurUser: JSON.parse(localStorage.getItem('app')),
            user: null,
            isLoading: false,
            deleteUserID: '',
            FIO: {value:''}
        }
        this.loadAllUsersBirthdays = this.loadAllUsersBirthdays.bind(this);
    }

    loadAllUsersBirthdays() {
        this._isMounted && this.setState({
            isLoading: true
        });

        getUsersBirthday()
            .then(response => {
                this._isMounted && this.setState({
                    user: response,
                    isLoading: false
                });
                let byDate = this.state.user.slice(0);
                byDate.sort(function(a,b) {
                    return parseInt(a.birthday.substr(5,2)+a.birthday.substr(8,2))
                        - parseInt(b.birthday.substr(5,2)+b.birthday.substr(8,2));
                });
                for (let i = 0; i < byDate.length; i++){
                    byDate[i].id = i+1
                }
                this.setState({user: byDate})

            }).catch(error => {
            if(error.status === 404) {
                this._isMounted && this.setState({
                    notFound: true,
                    isLoading: false
                });
            } else {
                this._isMounted && this.setState({
                    serverError: true,
                    isLoading: false
                });
            }
        });
    }


    componentDidMount() {
        this._isMounted = true;
        this._isMounted && this.loadAllUsersBirthdays();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }


    render (){
        if(this.state.isLoading) {
            return <div className="text-center">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        }

        if(this.state.notFound) {
            return <NotFound/>;
        }

        if(this.state.serverError) {
            return <ServerError/>;
        }

        return (
            <div>
                <Row>
                    <NavigationPanel/>
                    <Col sm={{size: 2}} style={{backgroundColor:'white', borderRadius:10,height:'100%', width: '25%'}}>
                        {
                            this.state.user ? (
                                <div>
                                    {
                                        this.state.user.map(
                                            user =>
                                                <div>
                                                    {(user.id % 3 === 1) &&
                                                    <div className='birthday-block'>
                                                        <div className='birthday-block-content'>
                                                            <Link to={`/users/${user.username}`}><div style={{textAlign:"center"}}>{user.name}</div></Link>
                                                            <div style={{paddingTop:10,textAlign:"center"}}>{formatDateDayMonth(user.birthday)}</div>
                                                        </div>
                                                    </div>}
                                                </div>
                                        )
                                    }
                                </div>
                            ):null
                        }
                    </Col>
                    <Col sm={{size: 2,offset:1}} style={{backgroundColor:'white', borderRadius:10, height:'35%', width: '25%'}}>
                        {
                            this.state.user ? (
                                <div>
                                    {
                                        this.state.user.map(
                                            user =>
                                                <div>
                                                    {(user.id % 3 === 2) &&
                                                    <div className='birthday-block'>
                                                        <div className='birthday-block-content'>
                                                            <Link to={`/users/${user.username}`}><div style={{textAlign:"center"}}>{user.name}</div></Link>
                                                            <div style={{paddingTop:10,textAlign:"center"}}>{formatDateDayMonth(user.birthday)}</div>
                                                        </div>
                                                    </div>}
                                                </div>
                                        )
                                    }
                                </div>
                            ):null
                        }
                    </Col>
                    <Col sm={{size: 2,offset:1}} style={{backgroundColor:'white', borderRadius:10, height: '100%', width: '25%'}}>
                        {
                            this.state.user ? (
                                <div>
                                    {
                                        this.state.user.map(
                                            user =>
                                                <div>
                                                    {(user.id % 3 === 0) &&
                                                    <div className='birthday-block'>
                                                        <div className='birthday-block-content'>
                                                            <Link to={`/users/${user.username}`}><div style={{textAlign:"center"}}>{user.name}</div></Link>
                                                            <div style={{paddingTop:10,textAlign:"center"}}>{formatDateDayMonth(user.birthday)}</div>
                                                        </div>
                                                    </div>}
                                                </div>
                                        )
                                    }
                                </div>
                            ):null
                        }
                    </Col>
                </Row>
            </div>
        )
    }

}

export default BirthdayPage