import React, {Component} from 'react';
import {Input} from "mdbreact"
import NewTaskForm from "./Components/NewTaskForm";

const cardColor = ["success-color", "primary-color", "warning-color", "danger-color"]
const todoList = [
    {
        "id": "ef432037-5e41-4cca-8875-1441ec61cbe6",
        "description": "hello",
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
            todoList: todoList,
            show: false
        };

    }

    filterByKeyword = (keyword) => {
        if (keyword === undefined || keyword.length === 0) {
            this.setState({todoList: todoList});
        }
        else {
            this.setState((prevState) => ({
                    todoList: prevState.todoList.filter(item => item.description.includes(keyword))
                })
            );
        }
    };

    toggle = () => {
        this.setState({
            show: !this.state.show
        });
    };
    handleFormData = (formData) => {
        console.log(formData);
        this.toggle();
    };

    handleSearch = (event) => {
        const keyword = this.state.searchKeyWord;
        this.filterByKeyword(keyword);
        event.preventDefault();
    };


    deleteTask = (url) => {
        //Todo delete in database
        this.setState((prevState) => ({
                todoList: prevState.todoList.filter(item => item.url !== url)
            })
        );
    };

    handleSearchKeyPress = (event) => {
        if (event.key === "Enter") {
            this.filterByKeyword(event.target.value)
        }
    };

    handleChange = (event) => {
        this.setState({searchKeyWord: event.target.value});
        console.log("change to " + event.target.value)
    };

    render() {
        return (
            <div className="container">
                <div className="row">
                    <NewTaskForm title={"新建待办事项"} show={this.state.show} handleSubmit={this.handleFormData}/>
                </div>
                <div className="col-lg-9 ml-auto mr-auto">
                    <div className="row position-relative w-auto justify-content-md-center">
                        <form className="custom-control-inline justify-content-center" onSubmit={this.handleSearch}>
                            <div className="col-lg-12 mt-auto mb-auto">
                                <Input label="查询待办事项" onKeyPress={this.handleSearchKeyPress}
                                       onChange={this.handleChange}/>
                            </div>
                            <div className="col-lg-4 mt-auto mb-auto">
                                <button type="submit" className={"btn btn-danger btn-sm"}>
                                    查询
                                </button>
                            </div>
                            <div className="col-lg-4 mt-auto mb-auto">
                                <button type="button" onClick={this.toggle} className={"btn btn-danger btn-sm"}>
                                    新建
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="col-lg-9 ml-auto mr-auto">
                    {this.state.todoList.map((item) => {
                        let color = cardColor[item.priority].toString();
                        return (
                            <div className="card mb-lg-3">
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
        );
    }
}


export default App;
