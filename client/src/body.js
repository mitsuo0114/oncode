import React, {Component} from 'react';
import CodeEditor from './codeeditor'
import Folders from './folders'
import Question from './question'
import TestCases from './testcases'
import Controller from './controller'

const LeftBody = () => {
    return <div className="LeftBody">
        <Folders/>
    </div>
};

const CenterBody = () => {
    return <div className="CenterBody">
        <Question/>
        <Controller />
        <CodeEditor/>
    </div>
};
const RightBody = () => {
    return <div className="CenterRight">
        <TestCases/>
    </div>
};

const Body = () => {
    return <div className="Blocks">
        <LeftBody/>
        <CenterBody/>
        <RightBody/>
    </div>
};
export {Body}