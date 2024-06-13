import { useSelector } from "react-redux";
import DetailsAccordion from "./DetailsAccordion.js";

const ChannelTypeItem=({team, type, setChannelInfo, channelInfo})=>{
          const teams=useSelector(state=>state.teams);
          function handleClickChannel(teamId, channelIndex){
                    setChannelInfo({
                              teamIndex: teams.findIndex(team=>team.id==teamId), 
                              channelIndex: channelIndex
                    });
          }
          return(
                    <div className="accordion-item">
                              <h2 className="accordion-header">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                                                  data-bs-target={"#"+type+team.id} aria-expanded="false" 
                                                  aria-controls={type+team.id}># {type}
                                        </button>
                              </h2>
                              <div id={type+team.id} className="accordion-collapse collapse" data-bs-parent={"channelType-"+team.id}>
                              <div className="accordion-body">
                                        {team.channels.map((channel,index)=>{
                                                  if(channel.type==type) return(
                                                            <a className={"list-group-item list-group-item-action"+(index===channelInfo.channelIndex?" h6":"")} 
                                                                      onClick={()=>handleClickChannel(team.id,index)} key={index}>
                                                                      # {channel.channelName}
                                                            </a>
                                                  )
                                        })}
                              </div>
                    </div>
          </div>
          )
}
export const ChannelType=(props)=>{
          const {team}=props;
          return(
                    <div className="accordion accordion-flush" id={"channelType-"+team.id}>
                              <ChannelTypeItem {...props} type="TEXT_CHANNEL"/>
                              <ChannelTypeItem {...props} type="VOICE_CHANNEL"/>
                              <DetailsAccordion {...props} />
                    </div>
          )
}