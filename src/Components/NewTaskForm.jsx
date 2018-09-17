import React, {Component} from 'react';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {Input} from "mdbreact"

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

    render() {
        return (
            <Modal isOpen={this.props.show}>
                <form onSubmit={this.handleSubmit}>
                    <ModalHeader>{this.props.title}</ModalHeader>
                    <ModalBody>
                        <div className="row">
                            <div className="form-group col-md-4">
                                <Input label={"待办事项标题"}
                                       onChange={(event) => this.setState({discription: event.target.value})}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md-4">
                                <Input label={"截止日期"}
                                       onChange={(event) => this.setState({deadline: event.target.value})}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md-4">
                                <label>Country:</label>
                                <input type="text" value={this.country} onChange={this.handleChangeCountry}
                                       className="form-control"/>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <input type="submit" value="Submit" color="primary" className="btn btn-primary"/>
                        <Button color="danger" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </form>
            </Modal>

        )
    }

}

export default NewTaskForm;
