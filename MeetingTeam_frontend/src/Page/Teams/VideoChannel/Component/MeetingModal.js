import { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { getDate, getTime } from "../../../../Util/DateTimeUtil.js";
import { createMeeting, updateMeeting } from "../../../../API/MeetingAPI.js";
import { useSnackbar } from "notistack";

const MeetingModal=({meeting,setShow, noChange})=>{
         const { enqueueSnackbar } = useSnackbar();
          const [dto, setDTO]=useState({...meeting});
          const [error, setError]=useState({txtScheduledTime:null, txtEndDate: null})
          const beginDateRef = useRef();
          const beginTimeRef = useRef();
         const daysOfWeek=["Sun","Mon","Tue","Wed","Thu","Fri","Sar"];
          function handleOnChange(e, fieldName, day){
                let value=null;
                if(fieldName=="title"||fieldName=="endDate") value=e.target.value;
                else if(fieldName=="scheduledTime"){
                        value=beginDateRef.current.value+"T"+beginTimeRef.current.value;
                        console.log("scheduledTime", value);
                }
                else if(fieldName=="scheduledDaysOfWeek"){
                        value=dto.scheduledDaysOfWeek;
                        if(value.has(day)) value.delete(day);
                        else  value.add(day);
                }
                setDTO(prev=>{
                        const updatedDTO={...prev}
                        updatedDTO[fieldName]=value;
                        return updatedDTO;
                })
          }
          function showSnackbar(content, isSuccess){
                const config = {variant:(isSuccess?"success":"error"),anchorOrigin:{ horizontal: 'center' , vertical: 'bottom'}}
                enqueueSnackbar(content, config);
          }
          function validateData(){
                let txtScheduledTime=null, txtEndDate= null;
                if(!dto.scheduledTime) txtScheduledTime="Schedule Time is required";
                else {
                        var beginDate=new Date(dto.scheduledTime);
                        if(dto.endDate){
                                dto.endDate =new Date(dto.endDate);
                                if(beginDate>dto.endDate) txtEndDate="End time must be after start date";
                        }
                }
                setError({txtScheduledTime, txtEndDate})
                return !(txtScheduledTime||txtEndDate);
          }
          function handleSubmit(e){
                e.preventDefault();
                if(validateData()){
                        const result={...dto};
                        result.scheduledDaysOfWeek=[...dto.scheduledDaysOfWeek];
                        result.createdAt=new Date();
                        console.log("Result", JSON.stringify(result));
                        if(!dto.id) createMeeting(result).
                                        then(res=>{
                                                showSnackbar("create new meeting successfully",true);
                                                setShow(null);
                                        })
                                        .catch(err=>showSnackbar(err.response.data,false));
                        else updateMeeting(result)
                                .then(res=>{
                                        showSnackbar("update meeting successfully", true);
                                        setShow(null);
                                })
                                .catch(err=>showSnackbar(err.response.data,false));
                }
          }
          return(
          <Modal show={true} onHide={()=>setShow(null)}>
                    <Modal.Header closeButton>
                            <Modal.Title>Edit Meeting</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                            <Form>
                                        <Row className="mb-3">
                                                <Form.Group as={Col} controlId="title">
                                                        <Form.Label>Title</Form.Label>
                                                        <Form.Control type="text" onChange={(e)=>handleOnChange(e,"title")} defaultValue={dto.title}/>
                                                </Form.Group>
                                        </Row>
                                        <Row className="mb-3">
                                                <Form.Group as={Col} controlId="scheduledTime">
                                                        <Form.Label>Start Time</Form.Label>
                                                        <Form.Control type="time" ref={beginTimeRef} onChange={(e)=>handleOnChange(e,"scheduledTime")} defaultValue={getTime(meeting.scheduledTime)}/>
                                                        <Form.Control type="date" ref={beginDateRef} onChange={(e)=>handleOnChange(e,"scheduledTime")} defaultValue={getDate(meeting.scheduledTime)}/>
                                                        <div style={error.txtScheduledTime ? { display: ''} : { display: 'none' }} className="error">{error.txtScheduledTime}</div>
                                                </Form.Group>
                                        </Row>
                                        <Row className="mb-3">
                                                <div className="col-auto">
                                                        <label htmlFor="scheduledDaysOfWeek" className="col-form-label">Repeat weekly</label>
                                                </div>
                                                <div className="col-auto">
                                                        <div className="btn-group" role="group" aria-label="Days of the Week">
                                                                {daysOfWeek.map((day, index)=>{
                                                                        let isChoosed=dto.scheduledDaysOfWeek.has(index+1);
                                                                        return(
                                                                                <button key={index} type="button" className={"btn btn-circle "+(isChoosed?"btn-primary":"btn-light")} onClick={(e)=>handleOnChange(e,"scheduledDaysOfWeek", index+1)}>
                                                                                        {day}
                                                                                </button>
                                                                        )
                                                                })}
                                                        </div>
                                                </div>
                                        </Row>
                                        <Row className="mb-3">
                                                <Form.Group as={Col} controlId="endDate" disabled={dto.scheduledDaysOfWeek.size==0}>
                                                        <Form.Label>End Date(if schedule meeting repeatly)</Form.Label>
                                                        <Form.Control type="date" onChange={(e)=>handleOnChange(e,"endDate")} defaultValue={getDate(meeting.endDate)}/>
                                                        <div style={error.txtEndDate? { display: ''} : { display: 'none' }} className="error">{error.txtEndDate}</div>
                                                </Form.Group>
                                        </Row>
                            </Form>
                    </Modal.Body>
                    {!noChange&&<Modal.Footer>
                        <Button variant="primary" onClick={(e)=>handleSubmit(e)}>Submit</Button>
                    </Modal.Footer>}
        </Modal>
          )
}
export default MeetingModal;