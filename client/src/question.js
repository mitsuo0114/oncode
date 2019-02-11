import React from "react";
import {connect} from "react-redux";

const Question = (props) => {
    let selected_program = props.program_id;
    let program_data = props.program_data;
    let all_programs = [];
    Object.keys(program_data).map((key) => {
        return program_data[key].map((name) => {
            return all_programs[name.program_id] = name
        });
    });
    // console.log(all_programs);
    let selected = all_programs[selected_program];

    return <div>
        <p>Question</p>
        <p>{selected.question}</p>
    </div>
};

function mapStateToProps(state, props) {
    return state
}

export default connect(mapStateToProps, null)(Question);
