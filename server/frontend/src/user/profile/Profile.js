import React, { Component } from 'react';
import { getUserProfile } from '../../util/APIUtils';
import { Avatar } from 'antd';
import { getAvatarColor } from '../../util/Colors';
import {formatDate, formatTime} from '../../util/Helpers';
import LoadingIndicator  from '../../common/LoadingIndicator';
import './Profile.css';
import NotFound from '../../common/NotFound';
import ServerError from '../../common/ServerError';
import {Row, Col, Button} from 'reactstrap';
import {TooltipWidgetHome,TooltipWidgetAtWork, TooltipWidgetHoliday, TooltipWidgetIll} from './TooltipWidget'


class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: false
        }
        this.loadUserProfile = this.loadUserProfile.bind(this);
    }

    loadUserProfile(username) {
        this.setState({
            isLoading: true
        });

        getUserProfile(username)
        .then(response => {
            this.setState({
                user: response,
                isLoading: false
            });
        }).catch(error => {
            if(error.status === 404) {
                this.setState({
                    notFound: true,
                    isLoading: false
                });
            } else {
                this.setState({
                    serverError: true,
                    isLoading: false
                });        
            }
        });        
    }



    componentDidMount() {
        const username = this.props.match.params.username;
        this.loadUserProfile(username);
    }

    componentDidUpdate(nextProps) {
        if(this.props.match.params.username !== nextProps.match.params.username) {
            this.loadUserProfile(nextProps.match.params.username);
        }
    }

    render() {
        if(this.state.isLoading) {
            return <div className="text-center">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>;
        }

        if(this.state.notFound) {
            return <NotFound />;
        }

        if(this.state.serverError) {
            return <ServerError />;
        }

        return (

            <div className="profile" >
                     {
                       this.state.user ? (
                <Row >
                    <Col sm={{ size: 4 }} style={{backgroundColor: '#EDEEF0',borderRadius:10,height:500}}>
                        <div style={{backgroundColor: 'white', margin: 20,borderRadius:10,height:300,width:300}}>
                            <Avatar className="user-avatar-circle" style={{ backgroundColor: getAvatarColor(this.state.user.name)}}>
                                {this.state.user.name.toUpperCase()}
                            </Avatar>
                        </div>
                        <Row>
                            <Col>
                                <div style={{color: 'gray', fontWeight: 'bold',height: 50}}>E-mail:</div>
                                <div style={{color: 'gray', fontWeight: 'bold',height: 50}}>Рабочий номер:</div>
                                <div style={{color: 'gray', fontWeight: 'bold',height: 50}}>Telegram:</div>
                            </Col>
                            <Col>
                                <div style={{height: 50}}>{this.state.user.email}</div>
                                <div style={{height: 50}}>{this.state.user.phone}</div>
                                <div style={{height: 50}}>@{this.state.user.tg}</div>
                            </Col>
                        </Row>
                    </Col>
                    <Col sm={{ size: 5, offset: 1}} style={{backgroundColor: '#EDEEF0',borderRadius:10,height:500}}>
                        <Row>
                            <Col>
                                <div style={{color: 'gray', marginTop:20, fontWeight: 'bold',height:50}}>Ф.И.О:</div>
                                <div style={{color: 'gray', marginTop:20, fontWeight: 'bold',height:50}}>О себе:</div>
                                <div style={{color: 'gray', fontWeight: 'bold',height:50}}>Должность:</div>
                                <div style={{color: 'gray', fontWeight: 'bold',height:50}}>Департамент:</div>
                                <div style={{color: 'gray', fontWeight: 'bold',height:50}}>Офис:</div>
                                <div style={{color: 'gray', fontWeight: 'bold',height:50}}>Рабочие часы:</div>
                                <div style={{color: 'gray', fontWeight: 'bold',height:50}}>В компании с:</div>
                                <div style={{color: 'gray', fontWeight: 'bold',height:50}}>Дата рождения:</div>
                                <div style={{color: 'gray', fontWeight: 'bold',height:50}}>Секретная заметка:</div>
                            </Col>
                            <Col>
                                <div style={{marginTop:20,height:50}}>{this.state.user.name}</div>
                                <div style={{marginTop:20,height:50}}>{this.state.user.about}</div>
                                <div style={{height:50}}>{this.state.user.position}</div>
                                <div style={{height:50}}>{this.state.user.department}</div>
                                <div style={{height:50}}>{this.state.user.office}</div>
                                <div style={{height:50}}>{formatTime(this.state.user.startAt)}-{formatTime(this.state.user.endAt)}</div>
                                <div style={{height:50}}>{formatDate(this.state.user.joinedAt)}</div>
                                <div style={{height:50}}>{formatDate(this.state.user.birthday)}</div>
                                <div style={{height:50}}>{this.state.user.secretNote}</div>
                                <div style={{marginTop:15}}>
                                    <Button color="primary" size="sm" href={`/users/${this.state.user.username}/edit`}>
                                        Редактировать
                                    </Button>
                                </div>
                            </Col>
                            {this.state.user.status === '0' && <TooltipWidgetHome/>}
                            {this.state.user.status === '1' && <TooltipWidgetAtWork/>}
                            {this.state.user.status === '2' && <TooltipWidgetIll/>}
                            {this.state.user.status === '3' && <TooltipWidgetHoliday/>}
                        </Row>
                    </Col>
                </Row>

                       ): null
                                }
            </div>
        );
    }
}

export default Profile;