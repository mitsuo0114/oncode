import React, {Component} from 'react';
import {ContentState, Editor, EditorState, getDefaultKeyBinding, convertToRaw, KeyBindingUtil} from 'draft-js';
import {connect} from "react-redux";
import {submit_code} from "./App";

const {hasCommandModifier} = KeyBindingUtil;

class CodeEditor extends React.Component {
    constructor(props) {
        super(props);
        const selected = props.program_data[props.program_id];

        // this.state = {editorState: EditorState.createEmpty()};
        var c = ContentState.createFromText(selected.initial_code.join());
        this.state = {editorState: EditorState.createWithContent(c)};
        this.onChange = (editorState) => this.setState({editorState});
        this.handleKeyCommand = this.handleKeyCommand.bind(this);
        this.props = props
    }


    keyBindingFn(e) {

        if (hasCommandModifier(e)) {
            if (e.keyCode === 83 /* `S` key */) {
                if (e.nativeEvent.shiftKey) {
                    console.log("Ctrl+Shift+S pressed");
                } else {
                    return 'save';
                }
            } else if (e.keyCode === 90 /* 'Z' */) {
                if (e.nativeEvent.shiftKey) {
                    return "redo"
                } else {
                    return "undo"
                }
            }

        }
        return getDefaultKeyBinding(e);
    }

    handleKeyCommand(command, editorState) {
        if (editorState.currentContent) {
            console.log(editorState.currentContent.getPlainText());
        }
        if (command === 'save') {
            console.log("save");
            this.props.submit_code(this.props);
            return 'handled';
        } else if (command === "undo") {
            this.setState({editorState: EditorState.undo(editorState)});
            return 'handled';
        } else if (command === "redo") {
            this.setState({editorState: EditorState.redo(editorState)});
            return 'handled';
        }
        return 'not-handled';
    }

    componentDidMount() {
        console.log("[MyEditor.js] componentDidMount was called");
        // const content = ContentState.createFromText(this.state.text);
        // const editor = EditorState.createWithContent(content);
        // this.setState({editorState: editor})
    }

    render() {
        return <div className="MainEditor">
            <Editor editorState={this.state.editorState}
                    handleKeyCommand={this.handleKeyCommand}
                    keyBindingFn={this.keyBindingFn}
                    onChange={this.onChange}/>
        </div>
    }
}

function mapStateToProps(state, props) {
    return state
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        submit_code: (props) => {
            dispatch(submit_code(props))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CodeEditor);

