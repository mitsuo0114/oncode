import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga'
import rootSaga from './sagas'

var initialState = {
        program_id: "level0-add",
        program_data: {
            "level0-add": {
                "program_id": "level0-add",
                "short_title": "Add",
                "question": "hogehoge変数二つを足す関数を作成する。",
                "initial_code": ["def add(a, b):\n    return a + b"],
                "function_params": ["a", "b"],
                "testcases": [
                    {
                        "input": [1, 2],
                        "expect": 3,
                        "output": "-"
                    },
                    {
                        "input": [-1, 6],
                        "expect": 5,
                        "output": "-"
                    }
                ],
            },
            "level0-sub": {
                "program_id": "level0-sub",
                "short_title": "Sub",
                "question": "変数二つを引く関数を作成する。",
                "initial_code": ["def sub(a, b):\n    return a - b"],
                "function_params": ["a", "b"],
                "testcases": [
                    {
                        "input": [2, 1],
                        "expect": 1,
                        "output": "--"
                    },
                    {
                        "input": [-1, 6],
                        "expect": -7,
                        "output": "--"
                    }
                ],
            },
        }
    }
;

const reducer = (state = initialState, action) => {
    console.log("reducer was called");
    console.log(state);
    console.log(action);
    const all_programs = [];
    let selected_program;
    switch (action.type) {
        case "CHANGE_PROGRAM":
            return Object.assign({}, state,
                {program_id: action.program_id});
        case "UPDATE_PROGRAM":
            return Object.assign({}, state,
                {program_data: action.program_data});
        case "INIT_WEBSOCKET":
            return Object.assign({}, state, {ws: action.ws});
        case "SUBMIT_CODE":
            action.ws.send(action.code);
            return state;
        case "SHOW_TESTRESULT":
            console.log(action.result);
            selected_program = state.program_data[state.program_id];
            console.log(selected_program);
            console.log(selected_program.testcases);
            console.log(action.result.index);
            state.program_data[state.program_id].testcases[action.result.index].output = action.result;
            return Object.assign({}, state, {});
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
