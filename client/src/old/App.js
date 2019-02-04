import React, {Component} from 'react';
import './App.css';
import MyEditors from './MyEditors'
import Tooltips from './Tooltips'
import Header from './Header'

class App extends Component {

    render() {
        return (
            <div>
                <Header />
                <Tooltips />
                <MyEditors />
            </div>
        );
    }
}

export default App;
