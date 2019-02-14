import React, {Component} from 'react';
import {Editor, getDefaultKeyBinding, KeyBindingUtil} from 'draft-js';
import {connect} from "react-redux";
import {submit_code, on_editorchange, on_editorundo, on_editorredo} from "./App";

const {hasCommandModifier} = KeyBindingUtil;

class CodeEditor extends React.Component {
    constructor(props) {
        super(props);
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
            this.props.submit_code(this.props);
            return 'handled';
        } else if (command === "undo") {
            this.props.editor_undo(editorState);
            return 'handled';
        } else if (command === "redo") {
            this.props.editor_redo(editorState);
            return 'handled';
        }
        return 'not-handled';
    }

    // componentDidMount() {
    //     // console.log("[MyEditor.js] componentDidMount was called");
    //     // const content = ContentState.createFromText(this.state.text);
    //     // const editor = EditorState.createWithContent(content);
    //     // this.setState({editorState: editor})
    // }

    render() {
        return <div className="MainEditor">
            <Editor editorState={this.props.editor_state}
                    handleKeyCommand={this.handleKeyCommand}
                    keyBindingFn={this.keyBindingFn}
                    onChange={this.props.on_change}/>
        </div>
    }
}

function mapStateToProps(state, props) {
    return state
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        editor_undo: (editor_state) => {
            dispatch(on_editorundo(editor_state))
        },
        editor_redo: (editor_state) => {
            dispatch(on_editorredo(editor_state))
        },
        on_change: (editor_state) => {
            dispatch(on_editorchange(editor_state))
        },
        submit_code: (plain_text) => {
            dispatch(submit_code(plain_text))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CodeEditor);

