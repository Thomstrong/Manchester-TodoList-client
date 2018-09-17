import React, {Component} from 'react';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {Input} from "mdbreact"
import "react-datetime/css/react-datetime.css"
import Datetime from "react-datetime"

class NewTaskForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false
        };
    }

    handleSubmit = (event) => {
        this.props.handleSubmit(this.state);
        event.preventDefault();
    }

    consumeInput = (props) => {
        return (
            <Input label="截止日期" {...props} onChange={(event) => props.onChange(event.target.value)}/>
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
                                       onChange={(event) => this.setState({discription: event.target.value})}/>
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
                                <label>Country:</label>
                                <input type="text" value={this.country} onChange={this.handleChangeCountry}
                                       className="form-control"/>
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
