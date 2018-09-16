import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'mdbreact/dist/css/mdb.css'
import 'mdbreact/dist/scss/mdb.scss'
import {Input} from "mdbreact"

class SearchBox extends Component {
    handleKeyPress = (event) => {
        if(event.key === "Enter"){
            alert(event.target.value)
        }

    };

    render() {
        return (
            <Input label={this.props.label} onKeyPress={this.handleKeyPress}/>
        )
    }

}

export default SearchBox;
