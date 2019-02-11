import React from "react";
import {connect} from "react-redux";
import {change_program} from "./App";

const Folders = (props) => {
    let program_data = props.program_data;
    const folders = Object.keys(program_data).map((key) => {
        const files = program_data[key].map((name) => {
            return <p className="File" key={name.program_id} onClick={() => {
                props.change_program(name.program_id);
            }}> - {name.short_title} </p>
        });

        return <div className="Folder" key={1}> + {key}
            {files}
        </div>
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
