import React, {Component} from 'react';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {Input} from "mdbreact"
import "react-datetime/css/react-datetime.css"
import Datetime from "react-datetime"

const priorities = ["不急不急", "还能拖拖", "得抓紧了", "最高生产力"];
const cardColor = ["success-color", "primary-color", "warning-color", "danger-color"];

class NewTaskForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            isOpen: false,
            description: "",
            deadline: "",
            priority: 0,
            status: 0,
        };
    }

    toggleOpen = () => this.setState({isOpen: !this.state.isOpen});

    handleSubmit = (event) => {
        const retData = this.state;
        if (this.props.param) retData.id = this.props.param.id
        if (this.state.description.length === 0) {
            retData.description = this.props.param ? this.props.param.description : "";
        }
        if (retData.deadline.length === 0 || retData.description.length === 0) {
            alert("信息填写不完整")
        } else {

            this.props.handleSubmit(retData);
        }
        event.preventDefault();
    };

    consumeInput = (props) => {
        return (
            <Input onKeyPress={(event) => event.preventDefault()} label="截止日期" {...props}
                   onChange={(event) => props.onChange(event.target.value)}/>
        );
    };

    selectItem = (event) => {
        const value = event.target.value;
        const label = event.target.label;

        this.setState({
            priority: value,
            label: label
        });
        this.toggleOpen();
        event.preventDefault();
    };

    render() {
        return (
            <Modal isOpen={this.props.show}>
                <form onSubmit={this.handleSubmit}>
                    <div className="row">
                        <div className="form-group col-lg-12">
                            <ModalHeader>{this.props.title}</ModalHeader>
                        </div>
                    </div>

                    <ModalBody>
                        <div className="row">
                            <div className="form-group col-lg-12">
                                <Input label={"待办事项标题"}
                                       onChange={(event) => this.setState({description: event.target.value})}
                                       default={this.props.param ? this.props.param.description : ""}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-lg-12">
                                <Datetime renderInput={this.consumeInput}
                                          onChange={(value) => this.setState({deadline: value})}
                                          default={this.props.param ? this.props.param.deadline : ""}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-lg-12">
                                优先级：
                                <div className="dropdown">
                                    <button
                                        className={`btn dropdown-toggle ${cardColor[this.state.priority]}`}
                                        type="button"
                                        id="dropdownMenuButton"
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        onClick={this.toggleOpen}
                                    >
                                        {priorities[this.state.priority]}
                                    </button>
                                    <div className={`dropdown-menu${this.state.isOpen ? " show" : ""}`}
                                         aria-labelledby="dropdownMenuButton">
                                        {priorities.map((item, index) => {
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
                        </div>

                    </ModalBody>
                    <ModalFooter>
                        <input type="submit" value="提交" color="primary" className="btn btn-primary"/>
                        <Button color="danger" onClick={this.props.onClose}>取消</Button>
                    </ModalFooter>
                </form>
            </Modal>

        )
    }

}

export default NewTaskForm;
