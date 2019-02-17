import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga'
import rootSaga from './sagas'
import {ContentState, EditorState} from "draft-js";

var initialState = {
        editor_state: EditorState.createEmpty(),
        program_id: "level0-add",
        current_testcases: {},
        program_data: {}
    }
;

const reducer = (state = initialState, action) => {
    console.log("reducer was called");
    console.log(state);
    console.log(action);
    let selected_program;
    switch (action.type) {
        case "EDITOR_CHANGE":
            return Object.assign({}, state, {editor_state: action.editor_state});
        case "EDITOR_UNDO":
            return Object.assign({}, state, {editor_state: EditorState.undo(action.editor_state)});
        case "EDITOR_REDO":
            return Object.assign({}, state, {editor_state: EditorState.redo(action.editor_state)});
        case "CHANGE_PROGRAM":
            selected_program = state.program_data[action.program_id];
            const c = ContentState.createFromText(selected_program.initial_code.join());
            return Object.assign({}, state,
                {
                    program_id: action.program_id,
                    editor_state: EditorState.createWithContent(c),
                    current_testcases: selected_program.testcases
                });
        case "UPDATE_PROGRAM":
            selected_program = action.program_data[state.program_id];
            const cc = ContentState.createFromText(selected_program.initial_code.join());
            return Object.assign({}, state,
                {
                    editor_state: EditorState.createWithContent(cc),
                    current_testcases: selected_program.testcases,
                    program_data: action.program_data,
                });
        case "INIT_WEBSOCKET":
            return Object.assign({}, state, {ws: action.ws});
        case "SUBMIT_CODE":
            const data = {};
            data["program_id"] = state.program_id;
            data["code"] = action.code;
            console.log(JSON.stringify(data));
            action.ws.send(JSON.stringify(data));
            return state;
        case "SHOW_TESTRESULT":
            console.log(action.result);
            let testcase = Object.assign([], state.current_testcases);
            testcase[action.result.index] = action.result;
            return Object.assign({}, state,
                {
                    current_testcases: testcase,
                });
        default:
            return state
    }
};

const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer,
    initialState,
    applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);
export {store};
