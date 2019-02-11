import React from "react";
import {connect} from "react-redux";
import {change_program} from "./App";

const Folders = (props) => {
    const folders = Object.keys(props.program_data).map((data) => {
        return <p className="File" key={props.program_data[data].program_id} onClick={() => {
            props.change_program(props.program_data[data].program_id);
        }}> - {props.program_data[data].short_title} </p>
    });

    return <div className="Folders">
        {folders}
    </div>
};

function mapStateToProps(state, props) {
    return state
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        change_program: (program_id) => {
            dispatch(change_program(program_id))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Folders);
