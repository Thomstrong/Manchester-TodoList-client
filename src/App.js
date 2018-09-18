import React, {Component} from 'react';
import {Input} from "mdbreact"
import NewTaskForm from "./Components/NewTaskForm";
import axios from 'axios';
const cardColor = ["success-color", "primary-color", "warning-color", "danger-color"]
const priorityStr = ["不急不急", "还能拖拖", "得抓紧了", "最高生产力"]
const statusList = ["待完成", "已完成", "已放弃"]
const todoList = [
    {
        "id": "ef432037-5e41-4cca-8875-1441ec61cbe6",
        "description": "\u521b\u5efa\u6846\u67b6",
        "deadline": "2018-09-16T13:00:00",
        "restTime": "\u903e\u671f 2 \u5929 9 \u5c0f\u65f6 39 \u5206\u949f",
        "priority": 0,
        "status": 1,
        "url": "http://127.0.0.1:8005/api/todoList/ef432037-5e41-4cca-8875-1441ec61cbe6/"
    },
    {
        "id": "1b3d623f-3012-4edf-9f1c-ac7bdd6586eb",
        "description": "\u521b\u5efa\u6846\u67b6",
        "deadline": "2018-09-18T00:00:00",
        "restTime": "\u8fd8\u5269 0 \u5929 1 \u5c0f\u65f6 21 \u5206\u949f",
        "priority": 1,
        "status": 2,
        "url": "http://127.0.0.1:8005/api/todoList/1b3d623f-3012-4edf-9f1c-ac7bdd6586eb/"
    },
    {
        "id": "9e264176-f313-47e0-a0d8-fc48657ed20c",
        "description": "\u524d\u540e\u7aef\u8054\u8c03",
        "deadline": "2018-09-17T00:00:00",
        "restTime": "\u903e\u671f 1 \u5929 22 \u5c0f\u65f6 39 \u5206\u949f",
        "priority": 2,
        "status": 0,
        "url": "http://127.0.0.1:8005/api/todoList/9e264176-f313-47e0-a0d8-fc48657ed20c/"
    },
    {
        "id": "2aa264b5-bb31-4d63-a5d6-7facad0f7494",
        "description": "\u524d\u540e\u7aef\u8054\u8c03\u5b8c\u6210",
        "deadline": "2018-09-24T00:00:00",
        "restTime": "\u8fd8\u5269 6 \u5929 1 \u5c0f\u65f6 21 \u5206\u949f",
        "priority": 3,
        "status": 0,
        "url": "http://127.0.0.1:8005/api/todoList/2aa264b5-bb31-4d63-a5d6-7facad0f7494/"
    }
];

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todoList: todoList,
            newDialog: false,
            modifyDialog: false,
            searchKeyWord: "",
        };

    }

    filterByKeyword = (keyword) => {
        if (keyword === undefined || keyword.length === 0) {
            this.setState({todoList: todoList});
        }
        else {
            this.setState({todoList: todoList.filter(item => item.description.includes(keyword))});
        }
    };

    toggle = (type) => {
        if (type === "new") {
            this.setState({
                newDialog: !this.state.newDialog
            })
        } else {
            this.setState({
                modifyDialog: !this.state.modifyDialog
            })
        }

    };

    handleNewTask = () => {
        this.setState({
            newDialog: !this.state.newDialog
        })
    };

    handleUpdateTask = (item) => {
        this.setState({
            modifyDialog: !this.state.modifyDialog,
            updateData: item
        })
    };

    handleStatusChange = (url, staus) => {

    }

    handleFormData = (formData, method) => {
        console.log(formData);
        let deadline = formData.deadline.format("YYYY-MM-DD hh:mm:ss");
        console.log(deadline);
        if (method === "POST") {
            this.toggle("new")
        } else {
            this.toggle("modify")
        }
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
                    <NewTaskForm onClose={() => this.toggle("new")} title={"新建待办事项"} show={this.state.newDialog}
                                 handleSubmit={(data) => this.handleFormData(data, "POST")}/>
                </div>
                <div className="row">
                    <NewTaskForm param={this.state.updateData} onClose={() => this.toggle("modify")} title={"修改待办事项"}
                                 show={this.state.modifyDialog}
                                 handleSubmit={(data) => this.handleFormData(data, "PUT")}/>
                </div>
                <div className="col-lg-9 ml-auto mr-auto">
                    <div className="row position-relative w-auto justify-content-md-center">
                        <form className="custom-control-inline justify-content-center" onSubmit={this.handleSearch}>
                            <div className="col-lg-12 mt-auto mb-auto">
                                <Input className="ds-input" label="查询待办事项" onKeyPress={this.handleSearchKeyPress}
                                       onChange={this.handleChange}/>
                            </div>
                            <div className="col-lg-4 mt-auto mb-auto">
                                <button type="submit" className={"btn btn-danger btn-sm"}>
                                    查询
                                </button>
                            </div>
                            <div className="col-lg-4 mt-auto mb-auto">
                                <button type="button" onClick={this.handleNewTask} className={"btn btn-danger btn-sm"}>
                                    新建
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="col-lg-9 ml-auto mr-auto">
                    {this.state.todoList.map((item) => {

                        let color = cardColor[item.priority].toString();
                        if (item.status === 2) color = "rgba-black-light"
                        return (
                            <div className="card mb-lg-3">
                                <div className={"card-header lighten-1 white-text " + color}>
                                    <p className="mb-auto">
                                        {item.description}
                                    </p>
                                    <span className="badge custom-control-inline">{priorityStr[item.priority]}</span>
                                </div>
                                <div className="card-body">
                                    <p className="card-text">{"截止日期：" + item.deadline}</p>
                                    <p className="card-text">{"剩余时间：" + item.restTime}</p>
                                    <p className="card-text">{"当前状态：" + statusList[item.status] + (item.status === 1 ? "√" : "")}</p>
                                    <button onClick={() => this.deleteTask(item.url)} type="button"
                                            className={"btn btn-sm " + color}>
                                        删除
                                    </button>
                                    <button onClick={() => this.handleUpdateTask(item)} type="button"
                                            className={"btn btn-sm " + color}>
                                        修改
                                    </button>
                                    {
                                        item.status === 0 ?
                                            (<div className="custom-control-inline">
                                                    <button onClick={() => this.handleStatusChange(item.url, 1)}
                                                            type="button"
                                                            className={"btn btn-sm " + color}>
                                                        完成
                                                    </button>
                                                    <button onClick={() => this.handleStatusChange(item.url, 2)}
                                                            type="button"
                                                            className={"btn btn-sm " + color}>
                                                        放弃
                                                    </button>
                                                </div>
                                            ) : ""
                                    }
                                    {
                                        item.status === 2?<button onClick={() => this.handleStatusChange(item.url, 0)}
                                                                  type="button"
                                                                  className={"btn btn-sm " + color}>
                                            重新开始
                                        </button>:""
                                    }


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
