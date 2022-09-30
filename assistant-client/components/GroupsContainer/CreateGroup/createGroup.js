import "bootstrap/dist/css/bootstrap.min.css";
import React, { Component } from "react";
import { Form, FormControl, Button, FormLabel, FormGroup } from 'react-bootstrap'
import Card from "react-bootstrap/Card";
import Modal from 'react-bootstrap/Modal'
import { checkNameGroup } from "../../../controllers/checkController";
import { existGroup } from "../../../controllers/groupController";
import StepperGroup from '../../groups/stepperGroup'


export default class CreateGroup extends React.Component {

  // open popup
  openPopupHandler() {
    this.setState({ openPopup: (!this.state.openPopup) })
  }

  constructor(props) {
    super(props);
    this.state = {
      parameters: {},
      items: [],
      isLoaded: true,
      error: null,
      openPopup: false,
      name: "",
      allowCreate: false,
      checkName: false,
    };

  }

  updateLoaded(){
    this.props.container.updateLoaded()
  }

  checkAll(type, value) {

    switch (type) {
        case "name":
            if (checkNameGroup(value)) {
                existGroup((res, err) => {
                    if (err != null) {
                      this.setState({ checkName: false })
                    } else {
                      if (!res) this.setState({ checkName: true })
                      else this.setState({ checkName: false })
                    }
                    this.check()
                  }, value)
            } else {
                this.setState({ checkName: false })
            }
            break;
        default: break;
    }
    this.check()

}

check() {
    if (this.state.checkName) { this.setState({ allowCreate: true }) }
    else { this.setState({ allowCreate: false }) }
}

  render() {

    if (this.state.error) {
      return <div>Error: {error.message}</div>;
    } else if (!this.state.isLoaded) {
      return <div>Loading...</div>;
    } else {

      var providers = this.state.items;
      var controls = [];
      return (
        <>
          <tr className="bigCard" >
            <th className="headerCustom">
              Aggiungi Gruppo
            </th>
            <th>
              <Form id="formGroup">
                <Form.Group controlId="formBasicEmail" style={{ margin: "0 0 8px 0" }}>
                  <Form.Control className={this.state.checkName !== false ? "oK" : ""} name="name" type="text" placeholder="Nome" onChange={e => {this.setState({ name: e.target.value }); this.checkAll("name", e.target.value) }} />
                </Form.Group>
              </Form>
            </th>
            <th>
              <Button variant="primary" type="button" style={{ margin: "0 0 8px 0" }} disabled={!this.state.allowCreate} onClick={() => { if (this.state.allowCreate) this.openPopupHandler() }}>
                Crea
              </Button>
            </th>
          </tr>

          <Modal show={this.state.openPopup} onHide={() => this.openPopupHandler()}>
            <StepperGroup container={this} name={this.state.name} />
          </Modal>
        </>
      );

    }
  }
}