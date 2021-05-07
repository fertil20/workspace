import React, { Component } from 'react';
import { getUserProfile } from '../../util/APIUtils';
import { Avatar } from 'antd';
import { getAvatarColor } from '../../util/Colors';
import {formatDate, formatTime} from '../../util/Helpers';
import './Profile.css';
import NotFound from '../../common/NotFound';
import ServerError from '../../common/ServerError';
import {Row, Col, Button} from 'reactstrap';
import {TooltipWidgetHome,TooltipWidgetAtWork, TooltipWidgetHoliday, TooltipWidgetIll} from './TooltipWidget'
import NavigationPanel from "../../common/NavigationPanel";
import formatPhoneNumber from "react-phone-number-input/modules/libphonenumber/formatPhoneNumber";
import {formatPhoneNumberIntl} from "react-phone-number-input";


class Profile extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
        this.state = {
            CurUser: JSON.parse(localStorage.getItem('app')),
            user: null,
            isLoading: false
        }
        this.loadUserProfile = this.loadUserProfile.bind(this);
    }

    loadUserProfile(username) {
        this._isMounted && this.setState({
            isLoading: true
        });

        getUserProfile(username)
        .then(response => {
            this._isMounted && this.setState({
                user: response,
                isLoading: false
            });
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
        this._isMounted && this.loadUserProfile(this.props.match.params.username);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidUpdate(prevProps) {
        if(this.props.match.params.username !== prevProps.match.params.username) {
            this.loadUserProfile(prevProps.match.params.username);
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
                    <NavigationPanel/>
                    <Col sm={{ size: 4.4 }} style={{backgroundColor: 'white',borderRadius:10,height:500,marginRight:30}}>
                        <div style={{backgroundColor: 'white', margin: 20,borderRadius:10,height:300,width:300}}>
                            <Avatar className="user-avatar-circle" style={{ backgroundColor: getAvatarColor(this.state.user.name)}}>
                                {this.state.user.name.toUpperCase()}
                            </Avatar>
                        </div>
                        <Row>
                            <Col >
                                <div className='profile-text1'>E-mail:</div>
                                <div className='profile-text1'>Рабочий номер:</div>
                                <div className='profile-text1'>Telegram:</div>
                            </Col>
                            <Col >
                                <div className='profile-text2'>{this.state.user.email}</div>
                                <div className='profile-text2'>{formatPhoneNumberIntl(this.state.user.phone)}</div>
                                <div className='profile-text2'>@{this.state.user.tg}</div>
                            </Col>
                        </Row>
                    </Col>
                    <Col sm={{ size: 6.6}} style={{backgroundColor: 'white',borderRadius:10,height:500, width:465}}>
                        <Row>
                            <Col sm={{ size: 'auto'}}>
                                <div className='profile-text1' style={{marginTop:20,width:50}}>Ф.И.О:</div>
                                <div className='profile-text1' style={{marginTop:20}}>О себе:</div>
                                <div className='profile-text1'>Должность:</div>
                                <div className='profile-text1'>Департамент:</div>
                                <div className='profile-text1'>Офис:</div>
                                <div className='profile-text1'>Рабочие часы:</div>
                                <div className='profile-text1'>В компании с:</div>
                                <div className='profile-text1'>Дата рождения:</div>
                                {this.state.CurUser.currentUser.privileges.includes('View_Secret') && <div className='profile-text1'>Секретная заметка:</div>}
                            </Col>
                            <Col >
                                <Row>
                                    <Col >
                                    <div style={{marginTop:20,height:50,width:200}}>{this.state.user.name}</div>
                                    </Col>
                                    <Col>
                                    <div style={{marginTop:20}}>
                                        {this.state.user.status === '0' && <TooltipWidgetHome/>}
                                        {this.state.user.status === '1' && <TooltipWidgetAtWork/>}
                                        {this.state.user.status === '2' && <TooltipWidgetIll/>}
                                        {this.state.user.status === '3' && <TooltipWidgetHoliday/>}
                                    </div>
                                    </Col>
                                </Row>
                                <div style={{marginTop:20,height:50}}>{this.state.user.about}</div>
                                <div style={{height:50}}>{this.state.user.position}</div>
                                <div style={{height:50}}>{this.state.user.department}</div>
                                <div style={{height:50}}>{this.state.user.office}</div>
                                <div style={{height:50}}>{formatTime(this.state.user.startAt)}-{formatTime(this.state.user.endAt)}</div>
                                <div style={{height:50}}>{formatDate(this.state.user.joinedAt)}</div>
                                <div style={{height:50}}>{formatDate(this.state.user.birthday)}</div>
                                {this.state.CurUser.currentUser.privileges.includes('View_Secret') && <div style={{height:50}}>{this.state.user.secretNote}</div>}
                                <div style={{marginTop:15}}>
                                    {(this.state.CurUser.currentUser.privileges.includes('Edit_Users') || this.state.user.username === this.state.CurUser.currentUser.username) &&
                                    <Button color="primary" size="sm" href={`/users/${this.state.user.username}/edit`}>
                                        Редактировать
                                    </Button>}
                                </div>
                            </Col>
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