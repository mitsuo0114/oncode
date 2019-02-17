import React from "react";
import {connect} from "react-redux";

const Question = (props) => {
    const selected = props.program_data[props.program_id];
    console.log(selected);
    if (selected) {
        return <div>
            <p>{selected.question}</p>
        </div>
    }else{
        return <div></div>
    }
};

function mapStateToProps(state, props) {
    return state
}

export default connect(mapStateToProps, null)(Question);
