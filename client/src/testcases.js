import React from "react";
import {connect} from "react-redux";
import './testcases.css';


const TestCases = (props) => {
    if (Object.keys(props.current_testcases).length > 0) {
        const cases = props.current_testcases.map((testcase) => {
            let inputs = testcase.input.map((input) => {
                return <td>{input}</td>
            });
            return <tr key={props.current_testcases.indexOf(testcase) + 1}
                       className={(testcase.verdict == null ? "" : testcase.verdict ? "TestCase_Success" : "TestCase_Fail")}>
                <td className="TestIndex">{props.current_testcases.indexOf(testcase) + 1}</td>
                {inputs}
                <td>{testcase.expect}</td>
                <td>{testcase.output}</td>
            </tr>
        });
        
        const params = props.program_data[props.program_id].function_params.map((param) => {
            return <td>{param}</td>
        });

        return <div>
            <table>
                <tbody>
                <tr>
                    <th>#</th>
                    <th colSpan={2}>Input</th>
                    <th>Expect</th>
                    <th>Output</th>
                </tr>
                <tr>
                    <td/>
                    {params}
                    <td/>
                    <td/>
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
