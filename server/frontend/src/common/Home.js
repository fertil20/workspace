import {Component} from "react";
import hello from "../media/hello.jpg";
import './Home.css';
export default class Home extends Component {
    render () { return (
        <div>
            <img src={hello} id="hello" width={500} height={500} alt='Hello' className="home"/>
        </div>
    );}}

