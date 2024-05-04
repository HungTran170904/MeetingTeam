import { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { createTeam } from "../../../API/TeamAPI.js";
import { useDispatch } from "react-redux";
import { updateTeam } from "../../../Redux/teamsReducer.js";

const CreateTeamModal=({setShow})=>{
          const dispatch=useDispatch();
          const [teamName, setTeamName]=useState("");
          function handleSubmit(){
                    createTeam({teamName: teamName}).then(res=>{
                              dispatch(updateTeam(res.data));
                    })
          }
          return(
                    <Modal show={true} onHide={()=>setShow(false)}>
                              <Modal.Header closeButton>
                                      <Modal.Title>Send team request</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                  <Form>
                                          <Row className="mb-3">
                                                  <Form.Group as={Col} controlId="teamId">
                                                          <Form.Label>Team name</Form.Label>
                                                          <Form.Control type="text" onChange={(e)=>setTeamName(e.target.value)}/>
                                                  </Form.Group>
                                          </Row>
                                  </Form>
                              </Modal.Body>
                              <Modal.Footer>
                                  <Button variant="primary" onClick={(e)=>handleSubmit(e)}>Submit</Button>
                              </Modal.Footer>
                  </Modal>
          )
}
export default CreateTeamModal;