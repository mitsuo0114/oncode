import React from "react";
import {connect} from "react-redux";

const TestCases = (props) => {
    const selected = props.program_data[props.program_id];
    if (Object.keys(props.current_testcases).length > 0) {
        const cases = props.current_testcases.map((testcase) => {
            let inputs = testcase.input.map((input) => {
                return <p key={testcase.input.indexOf(input)}>
                    {selected.function_params[testcase.input.indexOf(input)]} = {input}
                </p>
            });
            // console.log(testcase);
            return <tr key={props.current_testcases.indexOf(testcase) + 1}>
                <td className="TestIndex">{props.current_testcases.indexOf(testcase) + 1}</td>
                <td>{inputs}</td>
                <td>{testcase.expect}</td>
                <td>{testcase.output}</td>
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
    } else {
        return <div></div>
    }

};

function mapStateToProps(state, props) {
    return state
}

export default connect(mapStateToProps, null)(TestCases);
