import React, {Component} from 'react';
import {connect} from "react-redux";
import {submit_code} from "./App";


const Controller = (props) => {
    return <div>
        <button onClick={() => props.submit_code(props)}>submit</button>
    </div>
};

function mapStateToProps(state, props) {
    return state
}


const mapDispatchToProps = (dispatch, props) => {
    return {
        submit_code: (props) => {
            dispatch(submit_code(props))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Controller);
