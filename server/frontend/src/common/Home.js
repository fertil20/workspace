import React, {Component} from "react";
import hello1 from "../media/hello1.jpg";
import hello2 from "../media/hello2.jpg";
import hello3 from "../media/hello3.jpg";
import hello4 from "../media/hello4.jpg";
import './Home.css';
import NavigationPanel from "./NavigationPanel";
import {Row,Col} from 'reactstrap';

const randomImg = (Math.floor(Math.random() * 4 + 1));

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: JSON.parse(localStorage.getItem('app'))
        }
        this.loadMe = this.loadMe.bind(this)
    }

    loadMe() {
        this._isMounted && this.setState({
            user: JSON.parse(localStorage.getItem('app'))
        })
    }

    componentDidMount() {
        setInterval(() => {
            this.loadMe()
        }, 10);
        this._isMounted = true;
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.state.user.currentUser == null;
    }

    componentWillUnmount() {
        clearInterval()
        this._isMounted = false;
    }

    render () {
        if (this.state.user.currentUser !== null) {
            return (
                <div>
                    <Row>
                        <NavigationPanel/>
                        <Col sm={{size: 1.5}} style={{
                            backgroundColor: 'white',
                            borderRadius: 10,
                            height: 'auto',
                            paddingBottom: 20,
                            marginRight: 30
                        }}>
                            <div style={{width: 600}}>
                                {randomImg === 1 &&
                                <img src={hello1} id="hello" width={500} height={500} alt='Hello!' className="home"/>}
                                {randomImg === 2 &&
                                <img src={hello2} id="hello" width={500} height={500} alt='Hello!' className="home"/>}
                                {randomImg === 3 &&
                                <img src={hello3} id="hello" width={500} height={500} alt='Hello!' className="home"/>}
                                {randomImg === 4 &&
                                <img src={hello4} id="hello" width={500} height={500} alt='Hello!' className="home"/>}
                            </div>
                        </Col>
                        <Col sm={{size: 1.5}}
                             style={{backgroundColor: 'white', borderRadius: 10, height: 'auto', paddingBottom: 20}}>
                            <div style={{width: 210}}>
                                Новости
                            </div>
                        </Col>
                    </Row>
                </div>
            )
        }
        else
        {
            return (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )
        }
    }
}

