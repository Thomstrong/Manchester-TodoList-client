import React, {Component} from 'react';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {Input} from "mdbreact"
import "react-datetime/css/react-datetime.css"
import Datetime from "react-datetime"

class NewTaskForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            description: "",
            deadline: "",
            priority: 0,
            status: 0,
        };
    }

    handleSubmit = (event) => {
        if (this.state.description.length === 0 || this.state.deadline === 0) {
            alert("信息填写不完整")
        } else {
            this.props.handleSubmit(this.state);
        }
        event.preventDefault();
    }

    consumeInput = (props) => {
        return (
            <Input onKeyPress={(event) => event.preventDefault()} label="截止日期" {...props}
                   onChange={(event) => props.onChange(event.target.value)}/>
        );
    }

    render() {
        return (
            <Modal isOpen={this.props.show}>
                <form onSubmit={this.handleSubmit}>
                    <ModalHeader>{this.props.title}</ModalHeader>
                    <ModalBody>
                        <div className="row">
                            <div className="form-group col-lg-12">
                                <Input label={"待办事项标题"}
                                       onChange={(event) => this.setState({description: event.target.value})}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-lg-12">
                                <Datetime renderInput={this.consumeInput}
                                          onChange={(value) => this.setState({deadline: value})}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-lg-12">
                                {/*//Todo dropdown*/}
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
