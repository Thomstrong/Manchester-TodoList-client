import React, {Component} from 'react';
import {Input} from "mdbreact";
import NewTaskForm from "./Components/NewTaskForm";
import Moment from "moment";
import axios from 'axios';

import {cardColor, priorityStr, sortMethod, sortValue, statusList, url} from "./config"

let todoList = [];


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todoList: [],
            modalTitle: "",
            newDialog: false,
            modifyDialog: false,
            searchKeyWord: "",
            isOpen: false,
            sortMethod: "请选择排序依据",
            unfinishOnly: false,
        };
        axios.get(`${url}/`).then(res => {
            todoList = res.data;
            this.setNewTodoList();
        })

    }

    toggleOpen = () => this.setState({isOpen: !this.state.isOpen});

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
            modalTitle: "新建待办事项",
            newDialog: !this.state.newDialog
        })
    };


    handleUpdateTask = (item, title) => {
        let newData = JSON.parse(JSON.stringify(item));
        newData.deadline = newData.hasOwnProperty("deadline") ? new Moment(item.deadline) : item.deadline;
        this.setState({
            updateData: newData,
            modalTitle: title
        }, () => this.setState({modifyDialog: !this.state.modifyDialog,}))
    };

    handleStatusChange = (item, status) => {
        axios.post(`${url}/${item.id}/SetStatus/`, {"status": status}).then(res => {
            todoList[todoList.indexOf(item)].status = status;
            this.setNewTodoList();
        })
    };

    handleFormData = (formData, method) => {
        let data = {
            "description": formData.description,
            "deadline": formData.deadline.format("YYYY-MM-DD HH:mm:ss"),
            "priority": formData.priority,
            "status": 0
        };
        if (method === "POST") {
            axios.post(`${url}/`, data).then(res => {
                todoList.unshift(res.data);
                this.setNewTodoList();
            });
            this.toggle("new")
        } else {
            axios.put(`${url}/${formData.id}/`, data).then(res => {
                console.log(this.state.updateData)
                todoList.forEach(t => {
                    if (t.id === this.state.updateData.id) {
                        todoList[todoList.indexOf(t)] = res.data;
                    }
                });

                this.setState({updateData: undefined});
                this.setNewTodoList();
            });
            this.toggle("modify")
        }
    };

    handleSearch = (event) => {
        this.setNewTodoList();
        event.preventDefault();
    };


    deleteTask = (item) => {
        axios.delete(item.url).then((res) => {
            todoList = todoList.filter(_ => _.url !== item.url);
            this.setNewTodoList();
        })

    };

    setNewTodoList = () => {
        let showData = todoList;
        if (this.state.unfinishOnly) {
            showData = showData.filter(t => t.status === 0)
        }
        if (this.state.searchKeyWord && this.state.searchKeyWord.length > 0) {
            showData = showData.filter(item => item.description.includes(this.state.searchKeyWord))
        }
        this.setState({
            todoList: showData
        });
    };

    handleSearchKeyPress = (event) => {
        if (event.key === "Enter") {
            this.setState({
                searchKeyWord: event.target.value
            });
            this.setNewTodoList();
        }
    };

    handleChange = (event) => {
        this.setState({searchKeyWord: event.target.value});
        console.log("change to " + event.target.value)
    };

    selectSortingItem = (event) => {
        const value = event.target.value;
        const label = event.target.label;
        let sortMethod = sortValue[value];
        axios.get(`${url}?sorting=${sortMethod}`).then(res => {
            todoList = res.data;
            this.setState({
                sortMethod: label,
            }, this.setNewTodoList);
        });
        this.toggleOpen();
        event.preventDefault();
    };

    handleCheck = (event) => {
        if (this.state.unfinishOnly) {
            this.setState({
                unfinishOnly: false
            }, this.setNewTodoList)

        } else {
            this.setState({
                unfinishOnly: true
            }, this.setNewTodoList)
        }
    };

    render() {
        return (
            <div className="container">
                <div className="col">
                    <div className="row">
                        <NewTaskForm onClose={() => this.toggle("new")} title={this.state.modalTitle}
                                     show={this.state.newDialog}
                                     handleSubmit={(data) => this.handleFormData(data, "POST")}/>
                    </div>
                    <div className="row">
                        <NewTaskForm param={this.state.updateData} onClose={() => this.toggle("modify")}
                                     title={this.state.modalTitle}
                                     show={this.state.modifyDialog}
                                     handleSubmit={(data) => this.handleFormData(data, "PUT")}/>
                    </div>

                    <div className="col-lg-9 ml-auto mr-auto">
                        <div className="row position-relative justify-content-md-center">
                            <form className="custom-control-inline justify-content-center" onSubmit={this.handleSearch}>
                                <div className="col-7 mt-auto mb-auto">
                                    <Input className="ds-input" label="查询待办事项" onKeyPress={this.handleSearchKeyPress}
                                           onChange={this.handleChange}/>
                                </div>
                                <div className="col-auto mr-auto mt-auto mb-auto">
                                    <button type="submit" className="btn waves-effect btn-danger btn-sm">
                                        查询
                                    </button>
                                </div>
                                <div className="col-auto w-auto mr-auto mt-auto mb-auto">
                                    <button type="button" onClick={this.handleNewTask}
                                            className={"btn btn-danger btn-sm"}>
                                        新建
                                    </button>
                                </div>
                                <div className="col-sm-4 mt-auto mr-0 mb-auto">
                                    <div className="dropdown">
                                        <button
                                            className={`btn dropdown-toggle btn-danger btn-sm`}
                                            type="button"
                                            id="dropdownMenuButton"
                                            data-toggle="dropdown"
                                            aria-haspopup="true"
                                            onClick={this.toggleOpen}
                                        >
                                            {this.state.sortMethod}
                                        </button>
                                        <div className={`dropdown-menu${this.state.isOpen ? " show" : ""}`}
                                             aria-labelledby="dropdownMenuButton">
                                            {sortMethod.map((item, index) => {
                                                return (
                                                    <option key={index} value={index} className="dropdown-item"
                                                            onClick={this.selectSortingItem}>
                                                        {item}
                                                    </option>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="col-9 form-inline ml-auto mr-auto">
                        <div className="col-auto form-inline ml-0 mr-auto">
                            <input className="form-check-input" type="checkbox" id="inlineFormCheckbox1"
                                   checked={this.state.unfinishOnly}
                                   onChange={this.handleCheck}/>
                            <label className="form-check-label" htmlFor="inlineFormCheckbox1">只显示待完成项</label>
                        </div>
                        <div className="col-auto ml-auto mr-0">
                            共有
                            <div className="badge danger-color">
                                {this.state.todoList.length}
                            </div>
                            个待办事项
                        </div>
                    </div>

                    <div className="col-lg-9 ml-auto mr-auto">
                        {this.state.todoList.map((item) => {

                            let color = cardColor[item.priority];
                            if (item.status === 2) color = "rgba-black-light";
                            return (
                                <div key={item.id} className="card mb-lg-4">
                                    <div className={"card-header lighten-1 white-text " + color}>
                                        <p className="mb-auto ">
                                            {item.status === 1 ?
                                                <s className="text-black-50">{item.description}</s> : item.description}

                                        </p>
                                        <span className="badge custom-control-inline">
                                        {item.status === 2 ? "已放弃" : priorityStr[item.priority]}
                                        </span>
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text">{"截止时间：" + item.deadline}</p>
                                        <p className="card-text">{"剩余时间：" + item.restTime}</p>
                                        <p className="card-text">{"当前状态：" + statusList[item.status] + (item.status === 1 ? "√" : "")}</p>
                                        <button onClick={() => this.deleteTask(item)} type="button"
                                                className={"btn btn-sm " + color}>
                                            <p className="mb-auto">删除</p>
                                        </button>
                                        {
                                            item.status === 0 ?
                                                (<div className="custom-control-inline">
                                                        <button onClick={() => this.handleUpdateTask(item, "修改待办事项")}
                                                                type="button"
                                                                className={"btn btn-sm " + color}>
                                                            修改
                                                        </button>
                                                        <button onClick={() => this.handleStatusChange(item, 1)}
                                                                type="button"
                                                                className={"btn btn-sm " + color}>
                                                            完成
                                                        </button>
                                                        <button onClick={() => this.handleStatusChange(item, 2)}
                                                                type="button"
                                                                className={"btn btn-sm " + color}>
                                                            放弃
                                                        </button>
                                                    </div>
                                                ) : ""
                                        }
                                        {
                                            item.status === 2 ?
                                                <button onClick={() => this.handleUpdateTask(item, "重启待办事项")}
                                                        type="button"
                                                        className={"btn btn-sm " + color}>
                                                    重新开始
                                                </button> : ""
                                        }
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>
        );
    }
}


export default App;
