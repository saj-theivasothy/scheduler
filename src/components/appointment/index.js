import React from "react";

import "./styles.scss";

import Header from "components/appointment/Header";
import Show from "components/appointment/Show";
import Empty from "components/appointment/Empty";

export default function Appointment(props) {
  const appointmentStatus = props.interview ? <Show student={props.interview.student} interviewer={props.interview.interviewer} onEdit={console.log("onEdit")}
  onDelete={console.log("onDelete")}/> : <Empty />;
  return (
    <article className="appointment">
      <Header time={props.time} />
      {appointmentStatus}
    </article>
  );
}
