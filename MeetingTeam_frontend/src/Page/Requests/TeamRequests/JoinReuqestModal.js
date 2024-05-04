import { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { requestToJoinAteam } from "../../../API/TeamRequestAPI.js";

const JoinRequestModal=({setShow})=>{
          const [teamId, setTeamId]=useState("");
          const [content, setContent]=useState("");
          function handleSubmit(e){
                  e.preventDefault();
                  requestToJoinAteam({
                          team: {id: teamId},
                          content: content,
                          createdAt: new Date()
                  }).then(res=>alert("Request has been sent successfully"))
                  .catch(err=>alert("There is an error when sending request"))
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
                                                          <Form.Label>Team Id</Form.Label>
                                                          <Form.Control type="text" onChange={(e)=>setTeamId(e.target.value)}/>
                                                  </Form.Group>
                                          </Row>
                                          <Row className="mb-3">
                                                  <Form.Group as={Col} controlId="message">
                                                          <Form.Label>Message</Form.Label>
                                                          <Form.Control as="textarea" rows={3} onChange={(e)=>setContent(e.target.value)}/>
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
  export default JoinRequestModal;
  