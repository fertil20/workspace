import {Component} from "react";
import hello1 from "../media/hello1.jpg";
import hello2 from "../media/hello2.jpg";
import hello3 from "../media/hello3.jpg";
import './Home.css';

const randomImg = (Math.floor(Math.random() * 3 + 1));

export default class Home extends Component {
    render () {
        if (randomImg === 1)
            return (
                <div>
                    <img src={hello1} id="hello" width={500} height={500} alt='Hello!' className="home"/>
                </div>
            )
        if (randomImg === 2)
            return (
                <div>
                    <img src={hello2} id="hello" width={500} height={500} alt='Hello!' className="home"/>
                </div>
            )
        if (randomImg === 3)
            return (
                <div>
                    <img src={hello3} id="hello" width={500} height={500} alt='Hello!' className="home"/>
                </div>
            )
    }
}

