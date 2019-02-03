import React, {Component} from 'react';
import './App.css';
import MyEditor from './MyEditor'
import {Editor, EditorState, ContentState, getDefaultKeyBinding, convertToRaw, KeyBindingUtil} from 'draft-js';

class App extends Component {


    constructor(props) {
        super(props);
        this.ws = new WebSocket("ws://localhost:9001/");
        this.state = {
            editorState: EditorState.createEmpty(),
            text: "hogehgoe"
        };
        var data = [
            "def add(param1, param2):\n" +
            "     return int(param1) + int(param2)\n"
        ];
        this.init(this)
    }

    output = (str) => {
        var log = document.getElementById("log");
        var escaped = str.replace(/&/, "&amp;").replace(/</, "&lt;").replace(/>/, "&gt;").replace(/"/, "&quot;"); // "
        log.innerHTML = escaped + "<br>" + log.innerHTML;
    };

    init = (app) => {
        this.ws.onopen = function () {

            // output("onopen");
        };
        this.ws.onmessage = function (e) {
            console.log("ws.onmessage was called");
            // e.data contains received string.
            // this.output("onmessage: " + e.data);
            var json = JSON.parse(e.data);
            // console.log(json.content.initialcode);
            // console.log(state.texts);
            // app.state.editorState
            // console.log(state.texts);
            // if (editor.editorState) {
            //     console.log(json["set"]);
            //     console.log(editor.editorState.getCurrentContent());
            //     editor.editorState.text = "hogehoge" // json["initialcode"]
            //     editor.editorState.ContentState = editor.editorState.ContentState.createFromText("hogehoge")
            // }

        };
        this.ws.onclose = function () {
            // this.output("onclose");
        };
        this.ws.onerror = function (e) {
            // this.output("onerror");
            console.log(e)
        };
    };


    saveState = () => {
        console.log("save state was called");
        // const json = JSON.stringify(convertToRaw(this.editorState.getCurrentContent));
        // console.log(json);

        this.ws.send('{"command" : "init" }');
        // localStorage.setItem('mydata', JSON.stringify(convertToRaw(editorState.getCurrentContent())));
    };
    changeState = () => {
        console.log("changed" + this.state.text);
        this.setState({text: "hogehogehogehogehoge"});
        return "hogeeeeeeeeeeeee"
    };

    render() {
        return (
            <div className="Container">
                <MyEditor className="MyEditor" editorstate={this.state.editorState}
                          text={this.state.text} editable={true} onSave={this.saveState}
                          onChange={this.changeState}/>
            </div>
        );
    }
}

export default App;
