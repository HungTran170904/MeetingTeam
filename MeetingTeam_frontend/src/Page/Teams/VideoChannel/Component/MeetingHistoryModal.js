import {Button, Col, Modal, Row } from "react-bootstrap";
import { getDateTime } from "../../../../Util/DateTimeUtil.js";

const MeetingHistoryModal=({setShow, meetingMessages})=>{
          return(
                    <Modal show={true} onHide={()=>setShow(null)} scrollable={true}>
                    <Modal.Header closeButton>
                            <Modal.Title>Meeting History</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                           {meetingMessages&&meetingMessages.map(message=>{
                              return(
                                        <Row key={message.id}>
                                                  <Col lg="2">
                                                            {message.type=="START"?<i class="fa fa-pause" aria-hidden="true"></i>:<i class="fa fa-stop" aria-hidden="true"></i>}
                                                  </Col>
                                                  <Col lg="5">{getDateTime(message.createdAt)}</Col>
                                                  <Col lg="5">{meetingMessages.content}</Col>
                                        </Row>                                    
                              )
                           })}
                    </Modal.Body>
        </Modal>
          )
}
export default MeetingHistoryModal;