import { React } from "react";

export default function Alert(props) {
  return (
    <div className={`alert alert-${props.MsgType} py-1`} style={{ width: "380px" }}>
      {props.Msg}
    </div>
  );
}
