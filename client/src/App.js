import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

import {Header} from './components'
import {Body} from './body'
import {createStore} from 'redux'
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
                <Header program_id={this.props.program_id}/>
                <Body props={this.props}/>
            </div>
        );
    }
}


const CHANGE_PROGRAM = 'CHANGE_PROGRAM';

const change_program = (program_id) => {
    return {
        type: CHANGE_PROGRAM,
        program_id: program_id,
    }
};

var initialState = {
    program_id: "level0-add",
    program_data: {
        "Level 0": [
            {
                "program_id": "level0-add",
                "short_title": "Add",
                "question": "hogehoge変数二つを足す関数を作成する。",
                "initial_code": ["def add(a, b):\n    return a + b"],
                "function_params": ["a", "b"],
                "testcases": [
                    {
                        "input": [1, 2],
                        "expect": 3
                    },
                    {
                        "input": [-1, 6],
                        "expect": 5
                    }
                ],
            },
            {
                "program_id": "level0-sub",
                "short_title": "Sub",
                "question": "変数二つを引く関数を作成する。",
                "initial_code": ["def sub(a, b):\n    return a - b"],
                "function_params": ["a", "b"],
                "testcases": [
                    {
                        "input": [2, 1],
                        "expect": 1
                    },
                    {
                        "input": [-1, 6],
                        "expect": -7
                    }
                ],
            },
        ]
    }
};

const reducer = (state = initialState, action) => {
    console.log("reducer was called");
    console.log(state);
    console.log(action);

    switch (action.type) {
        case "CHANGE_PROGRAM":
            return Object.assign({}, state, {program_id: action.program_id});
        default:
            return state
    }
};


function mapStateToProps(state, props) {
    return state
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        change_program: (program_id) => {
            dispatch(change_program(program_id))
        }
    }
};

App = connect(mapStateToProps, mapDispatchToProps)(App);
const store = createStore(reducer);
export default App;
export {store};
