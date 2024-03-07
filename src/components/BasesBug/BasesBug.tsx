import { IoMdArrowDropup } from "react-icons/io";

interface Props{
    bases: boolean[];
}

const BasesBug = (props:Props) => {
    return (
        <div className="basesBug">
            <div className={"base " + (props.bases[0] ? "active" : "")}></div>
            <div className={"base " + (props.bases[1] ? "active" : "")}></div>
            <div className={"base " + (props.bases[2] ? "active" : "")}></div>
        </div>
    )
}

export default BasesBug;