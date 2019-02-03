import {Editor, EditorState, ContentState} from 'draft-js'
import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

import {createStore} from 'redux'
import {connect} from 'react-redux'


const program_data = {
    "Level 0": [
        {
            "program_id": "level0-add",
            "short_title": "Add",
            "question": "変数二つを足す関数を作成する。",
            "initial_code": ["def add(a, b):\n    return a + b"],
            "function_params": ["a", "b"],
            "testcases": [[
                {
                    "input": [1, 2],
                    "expect": 3
                },
                {
                    "input": [-1, 6],
                    "expect": 5
                }
            ]],
        },
        {
            "program_id": "level0-sub",
            "short_title": "Sub",
            "question": "変数二つを引く関数を作成する。",
            "initial_code": ["def sub(a, b):\n    return a - b"],
            "function_params": ["a", "b"],
            "testcases": [[
                {
                    "input": [2, 1],
                    "expect": 1
                },
                {
                    "input": [-1, 6],
                    "expect": -7
                }
            ]],
        },
    ]
};


const Header = (props) => {
    return <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <p>OnCode</p>
        <p>{props.program_id}</p>
    </header>
};

const Folders = (props) => {
    const folders = Object.keys(program_data).map((key) => {
        const files = program_data[key].map((name) => {
            return <p className="File" key={name.program_id} onClick={() => {
                props.props.props.props.change_program(name.program_id);
            }} > - {name.short_title} </p>
        });

        return <div className="Folder" key={1}> + {key}
            {files}
        </div>
    });

    return <div className="Folders">
        {folders}
    </div>
};

const Question = () => {
    return <div>
        <p>Question</p>
        <p>変数二つを足す関数を作成する。</p>
    </div>
};

class CodeEditor extends React.Component {
    constructor(props) {
        super(props);
        // this.state = {editorState: EditorState.createEmpty()};
        var c = ContentState.createFromText("def add(a, b):\n    return a + b");
        this.state = {editorState: EditorState.createWithContent(c)};
        this.onChange = (editorState) => this.setState({editorState})
    }

    render() {
        return <div className="MainEditor">
            <Editor editorState={this.state.editorState} onChange={this.onChange}/>
        </div>
    }
}

const TestCases = () => {
    return <div>
        <table className="TestCases">
            <tbody>
            <tr>
                <th className="TestIndex">#</th>
                <th>入力</th>
                <th>期待出力</th>
                <th>出力</th>
            </tr>

            <tr>
                <td className="TestIndex">1</td>
                <td> param1 = 1 <br/> param2 = 2</td>
                <td>3</td>
                <td>-</td>
            </tr>

            <tr>
                <td className="TestIndex">2</td>
                <td> param1 = -1 <br/> param2 = 6</td>
                <td>5</td>
                <td>-</td>
            </tr>
            </tbody>
        </table>
    </div>
};
const LeftBody = (props) => {
    return <div className="LeftBody">
        <Folders props={props}/>
    </div>
};

const CenterBody = () => {
    return <div className="CenterBody">
        <Question/>
        <CodeEditor/>
    </div>
};
const RightBody = () => {
    return <div className="CenterRight">
        <TestCases/>
    </div>
};

const Body = (props) => {
    return <div className="Blocks">
        <LeftBody props={props}/>
        <CenterBody/>
        <RightBody/>
    </div>
};

class App extends Component {
    render() {
        return (
            <div className="App">
                <input type="button" onClick={() => this.props.change_program()} />
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
    program_id: ""
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

App = connect(mapStateToProps,mapDispatchToProps)(App);
const store = createStore(reducer);
export default App;
export {store}


