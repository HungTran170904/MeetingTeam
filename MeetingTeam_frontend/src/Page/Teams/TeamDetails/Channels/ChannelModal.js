import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { updateChannel } from "../../../../API/ChannelAPI.js";

const  ChannelModal=({channel,setChannel})=>{
          function handleOnChange(e, fieldName){
                  channel[fieldName]=e.target.value;
          }
          function handleSubmit(e){
                  e.preventDefault();
                  updateChannel(channel);
          }
          return(
                  <Modal show={true} onHide={()=>setChannel(null)}>
                              <Modal.Header closeButton>
                                      <Modal.Title>Add or update channel</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                      <Form>
                                                  <Row className="mb-3">
                                                          <Form.Group as={Col} controlId="channelName">
                                                                  <Form.Label>Channel Name</Form.Label>
                                                                  <Form.Control type="text" onChange={(e)=>handleOnChange(e,"channelName")} defaultValue={channel.channelName}/>
                                                          </Form.Group>
                                                          <Form.Group as={Col} controlId="type">
                                                                  <Form.Label>Type</Form.Label>
                                                                  <Form.Select onChange={(e)=>handleOnChange(e,"type")} disabled={channel.id} defaultValue={channel.type}>
                                                                          <option value="TEXT_CHANNEL">TEXT_CHANNEL</option>
                                                                          <option value="VOICE_CHANNEL">VOICE_CHANNEL</option>
                                                                  </Form.Select>
                                                          </Form.Group>
                                                  </Row>
                                                  <Row className="mb-3">
                                                          <Form.Group as={Col} controlId="description">
                                                                  <Form.Label>Description</Form.Label>
                                                                  <Form.Control as="textarea" rows={3} onChange={(e)=>handleOnChange(e,"description")} defaultValue={channel.description}/>
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
export default ChannelModal;