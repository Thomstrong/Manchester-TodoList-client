import React, {Component} from 'react';
import SearchBox from "./Components/SearchBox";

const cardColor = {
    0: "success-color",
    1: "primary-color",
    2: "warning-color",
    3: "danger-color"
}
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
        "priority": 2,
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
        return (
            <div className="container">
                <div className="col-lg-8 ml-auto mr-auto">
                    <div className="row">
                        <div className="col-md-8 mt-auto mb-auto">
                            <SearchBox label={"查询代办事项"}/>
                        </div>
                        <div className="col-md-2 mt-auto mb-auto">
                            <button type="button" className={"btn btn-danger btn-sm"}>
                                查询
                            </button>
                        </div>
                        <div className="col-md-2 mt-auto mb-auto">
                            <button type="button" onClick={() => {
                                this.setState({open: true})
                            }} className={"btn btn-danger btn-sm"}>
                                新建
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-lg-8 ml-auto mr-auto">
                    {todoList.map((item) => {
                        let color = cardColor[item.priority].toString();
                        return (
                            <div className="card">
                                <div
                                    className={"card-header lighten-1 white-text " + color}>{item.description}</div>
                                <div className="card-body">
                                    <h4 className="card-title">Special title treatment</h4>
                                    <p className="card-text">{item.deadline}</p>
                                    <button onClick={() => this.deleteTask(item.url)} type="button"
                                            className={"btn btn-sm " + color}>
                                        删除
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}


export default App;
