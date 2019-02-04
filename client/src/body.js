import React, {Component} from 'react';
import {Folders, Question, CodeEditor, TestCases} from './components'


const LeftBody = (props) => {
    return <div className="LeftBody">
        <Folders props={props}/>
    </div>
};

const CenterBody = (props) => {
    return <div className="CenterBody">
        <Question props={props}/>
        <CodeEditor props={props}/>
    </div>
};
const RightBody = (props) => {
    return <div className="CenterRight">
        <TestCases props={props}/>
    </div>
};

const Body = (props) => {
    return <div className="Blocks">
        <LeftBody props={props}/>
        <CenterBody props={props}/>
        <RightBody props={props}/>
    </div>
};
export {Body}