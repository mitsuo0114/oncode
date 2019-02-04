import React, {Component} from 'react';
import logo from "./logo.svg";
import {ContentState, Editor, EditorState} from "draft-js";

const Header = (props) => {
    return <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <p>OnCode</p>
        <p>{props.program_id}</p>
    </header>
};


const Folders = (props) => {
    // console.log(props.props.props.props.program_data);
    let program_data = props.props.props.props.program_data;
    const folders = Object.keys(program_data).map((key) => {
        const files = program_data[key].map((name) => {
            return <p className="File" key={name.program_id} onClick={() => {
                props.props.props.props.change_program(name.program_id);
            }}> - {name.short_title} </p>
        });

        return <div className="Folder" key={1}> + {key}
            {files}
        </div>
    });

    return <div className="Folders">
        {folders}
    </div>
};

const Question = (props) => {
    // console.log("[Question]");
    // console.log(props.props.props.props);

    let selected_program = props.props.props.props.program_id;
    let program_data = props.props.props.props.program_data;
    let all_programs = [];
    Object.keys(program_data).map((key) => {
        program_data[key].map((name) => {
            all_programs[name.program_id] = name
        });
    });
    // console.log(all_programs);
    let selected = all_programs[selected_program];

    return <div>
        <p>Question</p>
        <p>{selected.question}</p>
    </div>
};

class CodeEditor extends React.Component {
    constructor(props) {
        super(props);
        let selected_program = props.props.props.props.program_id;
        let program_data = props.props.props.props.program_data;
        let all_programs = [];
        Object.keys(program_data).map((key) => {
            program_data[key].map((name) => {
                all_programs[name.program_id] = name
            });
        });
        let selected = all_programs[selected_program];

        // this.state = {editorState: EditorState.createEmpty()};
        var c = ContentState.createFromText(selected.initial_code.join());
        this.state = {editorState: EditorState.createWithContent(c)};
        this.onChange = (editorState) => this.setState({editorState})
    }

    render() {
        return <div className="MainEditor">
            <Editor editorState={this.state.editorState} onChange={this.onChange}/>
        </div>
    }
}

const TestCases = (props) => {
    let selected_program = props.props.props.props.program_id;
    let program_data = props.props.props.props.program_data;
    let all_programs = [];
    Object.keys(program_data).map((key) => {
        program_data[key].map((name) => {
            all_programs[name.program_id] = name
        });
    });
    let selected = all_programs[selected_program];
    // console.log("[TestCase]");
    // console.log(selected.testcases);
    // console.log(selected.function_params);

    const cases = selected.testcases.map((testcase) => {
        let inputs = testcase.input.map((input) => {
            return <p key={testcase.input.indexOf(input)}>
                {selected.function_params[testcase.input.indexOf(input)]} = {input}
            </p>
        });
        // console.log(testcase);
        return <tr key={selected.testcases.indexOf(testcase) + 1}>
            <td className="TestIndex">{selected.testcases.indexOf(testcase) + 1}</td>
            <td>{inputs}</td>
            <td>{testcase.expect}</td>
            <td>-</td>
        </tr>
    });

    return <div>
        <table className="TestCases">
            <tbody>
            <tr>
                <th className="TestIndex">#</th>
                <th>Input</th>
                <th>Expect</th>
                <th>Output</th>
            </tr>
            {cases}
            </tbody>
        </table>
    </div>
};
export {Folders, CodeEditor, Header, Question, TestCases}