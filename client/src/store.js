import {createStore} from 'redux'

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
        case "UPDATE_PROGRAM":
            return Object.assign({}, state, {program_data: action.program_data});
        default:
            return state
    }
};


const store = createStore(reducer);
export {store};
