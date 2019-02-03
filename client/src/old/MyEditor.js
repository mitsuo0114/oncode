import React from 'react';
import {Editor, EditorState, ContentState, getDefaultKeyBinding, convertToRaw, KeyBindingUtil} from 'draft-js';
import './MyEditor.css'

const {hasCommandModifier} = KeyBindingUtil;

class MyEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: props.editorstate,
            text: props.text
        };
        this.onChange = () => {
            var text = props.onChange()
            console.log("[MyEditor]onChange");
            const newText = text  + "Good night.";
            const newEditorState = EditorState.createWithContent(
                ContentState.createFromText(newText)
            );
            this.setState({editorState: newEditorState});
        };
        this.handleKeyCommand = this.handleKeyCommand.bind(this);
        this.onSave = props.onSave
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
            this.onSave();
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
        const content = ContentState.createFromText(this.state.text);
        const editor = EditorState.createWithContent(content);
        this.setState({editorState: editor})
    }

    render() {
            return (
                <div className="jp_content">
                    <Editor
                        editorState={this.state.editorState}
                        onChange={this.onChange}
                        handleKeyCommand={this.handleKeyCommand}
                        keyBindingFn={this.keyBindingFn}
                    />

                </div>
            );
    }
}

export default MyEditor