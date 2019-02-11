import React, {Component} from 'react';
import {ContentState, Editor, EditorState} from "draft-js";
import {connect} from "react-redux";


class CodeEditor extends React.Component {
    constructor(props) {
        super(props);
        let selected_program = props.program_id;
        let program_data = props.program_data;
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

function mapStateToProps(state, props) {
    return state
}

export default connect(mapStateToProps, null)(CodeEditor);
