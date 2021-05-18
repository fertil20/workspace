import React, {Component} from "react";
import hello1 from "../../media/hello1.jpg";
import hello2 from "../../media/hello2.jpg";
import hello3 from "../../media/hello3.jpg";
import hello4 from "../../media/hello4.jpg";
import './Home.css';
import NavigationPanel from "../navigation/NavigationPanel";
import {Row,Col} from 'reactstrap';
import ShortNews from "../news/newsShort";

const randomImg = (Math.floor(Math.random() * 6 + 1));

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
                <Row>
                    <NavigationPanel/>
                    <Col sm={{size: 1.5}} style={{
                        backgroundColor: 'white',
                        borderRadius: 10,
                        height: '100%',
                        padding: 10,
                        marginRight: '2%',
                        width: '53%'
                    }}>
                        <div style={{width: '100%', maxHeight: '80%'}}>
                            {randomImg === 1 &&
                            <img src={hello1} id="hello" alt='Hello!' className="home"/>}
                            {randomImg === 2 &&
                            <img src={hello2} id="hello" alt='Hello!' className="home"/>}
                            {randomImg === 3 &&
                            <img src={hello3} id="hello" alt='Hello!' className="home"/>}
                            {randomImg === 4 &&
                            <img src={hello4} id="hello" alt='Hello!' className="home"/>}
                            {randomImg === 5 &&
                            <img src="https://sun9-55.userapi.com/impg/cLkK91t6yMAcKLX2iCDkEB4mB4GmbXhASX0OFg/C8_gBhYMhAY.jpg?size=1080x867&quality=96&sign=a0ee44bb0407c0e7ecd8e11ff7f86ed6&type=album" alt='Hello!' className="home"/>}
                            {randomImg === 6 &&
                            <img src="https://sun9-30.userapi.com/impg/JI5Obz-cKWItsQEzj4uY4VhlqlfLs7Hmu2KkLw/IVf6VOJGAxg.jpg?size=1600x1374&quality=96&sign=50c4c0bebc35af815d0be0b582b1ae63&type=album" alt='Hello!' className="home"/>}
                        </div>
                    </Col>
                    <ShortNews/>
                </Row>
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

