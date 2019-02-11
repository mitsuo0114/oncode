import React, {Component} from 'react';
import './App.css';

import Header from './header'
import {Body} from './body'
import {connect} from 'react-redux'

class App extends Component {

    constructor(props) {
        super(props);
        console.log("[App] constructor was called");
        this.ws = new WebSocket("ws://localhost:9001/");
        this.ws.onopen = function () {
            console.log("[WebSocket] onopen");
        };
        this.ws.onmessage = function (e) {
            console.log("[WebSocket] onmessage: " + e.data);
            const jd = JSON.parse(e.data);
            if (jd["command"] == "init") {
                props.update_program(jd["content"])
            }
        };
        this.ws.onclose = function () {
            console.log("[WebSocket] onclose");
        };
        this.ws.onerror = function (e) {
            console.log("[WebSocket] onerror");
            console.log(e)
        };
    }

    render() {
        return (
            <div className="App">
                <Header/>
                <Body/>
            </div>
        );
    }
}


const CHANGE_PROGRAM = 'CHANGE_PROGRAM';
const UPDATE_PROGRAM = 'UPDATE_PROGRAM';
const change_program = (program_id) => {
    return {
        type: CHANGE_PROGRAM,
        program_id: program_id,
    }
};
const update_program = (program_data) => {
    return {
        type: UPDATE_PROGRAM,
        program_data: program_data,
    }
};

const mapDispatchToProps = (dispatch, props) => {
    return {
        change_program: (program_id) => {
            dispatch(change_program(program_id))
        },
        update_program: (program_data) => {
            dispatch(update_program(program_data))
        }

    }
};

App = connect(null, mapDispatchToProps)(App);
export default App;
export {change_program}
