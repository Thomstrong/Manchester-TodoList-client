import React, {Component} from 'react';
import {Input} from "mdbreact"
import NewTaskForm from "./Components/NewTaskForm";
import axios from 'axios';

const cardColor = ["primary-color", "secondary-color", "warning-color", "danger-color"]
const priorityStr = ["不急不急", "还能拖拖", "得抓紧了", "最高生产力"]
const statusList = ["待完成", "已完成", "已放弃"]
const sortMethod = ["按截止日期升序", "按截止日期降序", "按优先级升序", "按优先级降序"];
const sortValue = ["deadline", "-deadline", "priority", "-priority"]
const url = "http://127.0.0.1:8000/api/todoList";
let todoList = [];

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todoList: [],
            newDialog: false,
            modifyDialog: false,
            searchKeyWord: "",
            isOpen: false,
            sortMethod:"请选择排序依据"
        };
        axios.get(`${url}/`).then(res => {
            todoList = res.data;
            this.setState({todoList: res.data});
        })

    }

    toggleOpen = () => this.setState({isOpen: !this.state.isOpen});

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

    handleStatusChange = (item, status) => {
        axios.post(`${url}/${item.id}/SetStatus/`, {"status": status}).then(res => {
            todoList[todoList.indexOf(item)].status = status;
            this.setState({
                todoList: todoList
            })
        })
    }

    handleFormData = (formData, method) => {
        console.log(formData);
        let deadline = formData.deadline.format("YYYY-MM-DD hh:mm:ss");
        console.log(deadline);
        let data = {
            "description": formData.description,
            "deadline": formData.deadline.format("YYYY-MM-DD hh:mm:ss"),
            "priority": formData.priority,
            "status": 0
        }
        if (method === "POST") {
            axios.post(`${url}/`, data).then(res => {
                todoList.unshift(res.data);
                this.setState({
                    todoList: todoList
                })
            });
            this.toggle("new")
        } else {
            axios.put(`${url}/${formData.id}/`, data).then(res => {
                todoList[todoList.indexOf(this.state.updateData)] = res.data;
                this.setState({
                    todoList: todoList
                })
            });
            this.toggle("modify")
        }
    };

    handleSearch = (event) => {
        const keyword = this.state.searchKeyWord;
        this.filterByKeyword(keyword);
        event.preventDefault();
    };


    deleteTask = (item) => {
        axios.delete(item.url).then((res) => {
            todoList = todoList.filter(_ => _.url !== item.url);
            this.setState((prevState) => ({
                    todoList: todoList
                })
            );
        })

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

    selectItem = (event) => {
        const value = event.target.value;
        const label = event.target.label;
        let sortMethod = sortValue[value];
        axios.get(`${url}?sorting=${sortMethod}`).then(res => {
            todoList = res.data;
            this.setState({
                todoList: res.data,
                sortMethod: label,
            });
        });
        this.toggleOpen();
        event.preventDefault();
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
                    <div className="row position-relative justify-content-md-center">
                        <form className="custom-control-inline justify-content-center" onSubmit={this.handleSearch}>
                            <div className="col-7 mt-auto mb-auto">
                                <Input className="ds-input" label="查询待办事项" onKeyPress={this.handleSearchKeyPress}
                                       onChange={this.handleChange}/>
                            </div>
                            <div className="col-auto mr-auto mt-auto mb-auto">
                                <button type="submit" className={"btn btn-danger btn-sm"}>
                                    查询
                                </button>
                            </div>
                            <div className="col-auto w-auto mr-auto mt-auto mb-auto">
                                <button type="button" onClick={this.handleNewTask} className={"btn btn-danger btn-sm"}>
                                    新建
                                </button>
                            </div>
                            <div className="col-auto mt-auto mr-auto mb-auto">
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
                                                <option value={index} className="dropdown-item"
                                                        onClick={this.selectItem}>
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
                <div className="col-lg-9 ml-auto mr-auto">
                    {this.state.todoList.map((item) => {

                        let color = cardColor[item.priority];
                        if (item.status === 2) color = "rgba-black-light"
                        return (
                            <div className="card mb-lg-4">
                                <div className={"card-header lighten-1 white-text " + color}>
                                    <p className="mb-auto">
                                        {item.description}
                                    </p>
                                    <span className="badge custom-control-inline">
                                        {item.status === 2 ? "已放弃" : priorityStr[item.priority]}
                                        </span>
                                </div>
                                <div className="card-body">
                                    <p className="card-text">{"截止日期：" + item.deadline}</p>
                                    <p className="card-text">{"剩余时间：" + item.restTime}</p>
                                    <p className="card-text">{"当前状态：" + statusList[item.status] + (item.status === 1 ? "√" : "")}</p>
                                    <button onClick={() => this.deleteTask(item)} type="button"
                                            className={"btn btn-sm " + color}>
                                        删除
                                    </button>
                                    {
                                        item.status === 0 ?
                                            (<div className="custom-control-inline">
                                                    <button onClick={() => this.handleUpdateTask(item)} type="button"
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
                                        item.status === 2 ? <button onClick={() => this.handleUpdateTask(item)}
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
        );
    }
}


export default App;
