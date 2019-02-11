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
            } else if (jd["command"] == "show_testresult") {
                console.log("show_testresult")
                console.log(jd);
                props.show_testresult(jd)
            }
        };
        this.ws.onclose = function () {
            console.log("[WebSocket] onclose");
        };
        this.ws.onerror = function (e) {
            console.log("[WebSocket] onerror");
            console.log(e)
        };
        props.init_websocket(this.ws);
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

const INIT_WEBSOCKET = "INIT_WEBSOCKET";
const CHANGE_PROGRAM = 'CHANGE_PROGRAM';
const UPDATE_PROGRAM = 'UPDATE_PROGRAM';
const SUBMIT_CODE = "SUBMIT_CODE";
const SHOW_TESTRESULT = "SHOW_TESTRESULT";

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

const init_websocket = (ws) => {
    return {
        type: INIT_WEBSOCKET,
        ws: ws
    }
};

const submit_code = (props) => {
    console.log("submit_code");
    return {
        type: SUBMIT_CODE,
        ws: props.ws,
        code: props.program_data["level0-add"]["initial_code"].join()
    }
};

const show_testresult = (result_data) => {
    console.log(result_data);
    return {
        type: SHOW_TESTRESULT,
        result: result_data
    }
};

const mapDispatchToProps = (dispatch, props) => {
    return {
        change_program: (program_id) => {
            dispatch(change_program(program_id))
        },
        update_program: (program_data) => {
            dispatch(update_program(program_data))
        },
        init_websocket: (web_socket) => {
            dispatch(init_websocket(web_socket))
        },
        submit_code: () => {
            dispatch(submit_code())
        },
        show_testresult: (result_data) => {
            dispatch(show_testresult(result_data))
        }
    }
};

App = connect(null, mapDispatchToProps)(App);
export default App;
export {change_program, submit_code}
