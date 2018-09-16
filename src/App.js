import React, {Component} from 'react';
import SearchBox from "./Components/SearchBox";
import Panel from "react-bootstrap/es/Panel";

const todoList = [
    {
        "id": "ef432037-5e41-4cca-8875-1441ec61cbe6",
        "description": "\u521b\u5efa\u6846\u67b6",
        "deadline": "2018-09-16T13:00:00",
        "restTime": "-1 day, 13:33:26.875040",
        "priority": 0,
        "status": 0,
        "url": "http://127.0.0.1:8000/api/todoList/ef432037-5e41-4cca-8875-1441ec61cbe6/"
    },
    {
        "id": "1b3d623f-3012-4edf-9f1c-ac7bdd6586eb",
        "description": "\u521b\u5efa\u6846\u67b6",
        "deadline": "2018-09-18T00:00:00",
        "restTime": "1 day, 0:33:26.874559",
        "priority": 4,
        "status": 0,
        "url": "http://127.0.0.1:8000/api/todoList/1b3d623f-3012-4edf-9f1c-ac7bdd6586eb/"
    }
];

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todoList: todoList
        }
    }

    deleteTask = (url, e) => {
        //Todo delete in database
        this.setState((prevState) => ({
                todoList: prevState.todoList.filter(item => item.url !== url)
            })
        );
        alert(url)
    };

    render() {
        const todoList = this.state.todoList;
        console.log(todoList)
        return (
            <div>
                <div className="container">
                    <div className="col-lg-8 ml-auto mr-auto">
                        <div className="row">
                            <div className="col-md-8 mt-auto mb-auto">
                                <SearchBox label={"查询代办事项"}/>
                            </div>
                            <div className="col-md-4 mt-auto mb-auto">
                                <button type="button" className={"btn btn-danger btn-sm"}>+
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-8 ml-auto mr-auto">
                        {todoList.map((item) => {
                            return (<div bsStyle="primary" class="h-auto card card-body">
                                <Panel.Heading>
                                    <Panel.Title componentClass="h3">{item.description}</Panel.Title>
                                </Panel.Heading>
                                <Panel.Body>{item.deadline}</Panel.Body>
                                <Panel.Body>
                                    <button onClick={() => this.deleteTask(item.url)} type="button"
                                            className={"btn btn-danger btn-sm"}>
                                        删除
                                    </button>
                                </Panel.Body>
                            </div>)
                        })}
                    </div>
                </div>
            </div>
        )
    }
}


export default App;
