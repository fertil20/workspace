import React, {Component, useState} from 'react';
import {
    withRouter
} from 'react-router-dom';
import './AppHeader.css';
import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Row,
    Col
} from 'reactstrap';



class AppHeader extends Component {
    constructor(props) {
        super(props);   
        this.handleMenuClick = this.handleMenuClick.bind(this);   
    }

    handleMenuClick() {
        this.props.onLogout();
    }

    render() {
        if(this.props.currentUser) {
          return(
            <NavBarLogged className='header-of-app' currentUser={this.props.currentUser} handleMenuClick={this.handleMenuClick}/>
          )
        } else {
          return(
              <NavBarNotLogged/>
          )
        }
    }
}

const NavBarNotLogged = () => {

    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

        return (
            <div className='nav-bar-container'>
                <Row >
                    <Col>
                    </Col>
                    <Col>
                        <a href="/" style={{textDecoration: "none"}}><div className='main-title'>Workspace</div></a>
                    </Col>
                    <Col>
                    </Col>
                </Row>
            </div>
        );
}

function NavBarLogged(props){

    return (
        <div className='nav-bar-container'>
            <Row >
                <Col>
                </Col>
                <Col>
            <a href="/" style={{textDecoration: "none"}}><div className='main-title'>Workspace</div></a>
                </Col>
                <Col>
            <div className='caret-css'>
                <UncontrolledDropdown>
                    <DropdownToggle nav caret>
                        {props.currentUser.name}
                    </DropdownToggle>
                    <DropdownMenu right >
                        <div style={{textAlign:'center'}}>{props.currentUser.username}</div>
                        <div style={{textAlign:'center'}}> @{props.currentUser.username}</div>
                        <DropdownItem divider />
                        <DropdownItem href="/">
                            Главная
                        </DropdownItem>
                        <DropdownItem href="/news">
                            Новости
                        </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem href={`/users/${props.currentUser.username}`}>
                            Профиль
                        </DropdownItem>
                        <DropdownItem onClick={props.handleMenuClick} href="/login">
                            Выйти
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </div>
                </Col>
            </Row>
        </div>
    )
}

export default withRouter(AppHeader);


