import { Accordion, Button, Col, Modal, Row } from "react-bootstrap";
import { getDateTime } from "../../Util/DateTimeUtil.js";
import Avatar from "../Avatar/Avartar.js";
const VoteDetailModal=({message,team,setShow})=>{
          const members=team.members;
          return(
          <Modal show={true} onHide={()=>setShow({type:0, message:null})}>
                    <Modal.Header closeButton>
                              <Modal.Title>{message.content}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                              <Accordion>
                                        <Accordion.Item eventKey="0">
                                                  <Accordion.Header><i>Vote History</i></Accordion.Header>
                                                  <Accordion.Body>
                                                            {message.voting.events.map((votingEvent,index)=>(
                                                                      <Row key={index}>
                                                                                <Col lg="4">{getDateTime(votingEvent.createdAt)}</Col>
                                                                                <Col lg="8">{votingEvent.content}</Col>
                                                                      </Row>
                                                            ))}
                                                  </Accordion.Body>
                                        </Accordion.Item>
                                        {message.voting.options.map((option,index)=>{
                                                  return(
                                                  <Accordion.Item key={index} eventKey={index+1}>
                                                            <Accordion.Header>{option.name}</Accordion.Header>
                                                            <Accordion.Body>
                                                                     {option.userIds.map(userId=>{
                                                                                const owner=members.find(m=>m.u.id==userId);
                                                                                if(owner) return(
                                                                                          <Col lg="12" key={userId}><Avatar src={owner.u.urlIcon}/> {owner.u.nickName}</Col>
                                                                                )
                                                                     })}
                                                            </Accordion.Body>
                                                  </Accordion.Item>  
                                                  )
                                        })}
                              </Accordion>                           
                    </Modal.Body>
          </Modal>
          )
}
export default VoteDetailModal;