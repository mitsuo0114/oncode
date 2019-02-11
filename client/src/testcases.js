import React from "react";
import {connect} from "react-redux";

const TestCases = (props) => {
    let selected_program = props.program_id;
    let program_data = props.program_data;
    let all_programs = [];
    Object.keys(program_data).map((key) => {
        program_data[key].map((name) => {
            all_programs[name.program_id] = name
        });
    });
    let selected = all_programs[selected_program];

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

function mapStateToProps(state, props) {
    return state
}

export default connect(mapStateToProps, null)(TestCases);
