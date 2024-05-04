import Person from "../../Resource/Person.png"
const Avatar=({src})=>{
          return <img src={src?src:Person} alt="avatar" className="avatar"/>
}
export default Avatar;