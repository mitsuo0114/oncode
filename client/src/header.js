import logo from "./logo.svg";
import React from "react";
import {connect} from "react-redux";

const Header = (props) => {
    if (props.program_data[props.program_id] > 0){
        return <header className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <p>OnCode</p>
            <p> - {props.program_data[props.program_id].short_title}</p>
        </header>
    }else{
        return <header className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <p>OnCode</p>
        </header>
    }
};

function mapStateToProps(state, props) {
    return state
}

export default connect(mapStateToProps, null)(Header);
