import React from "react";

import "./styles.scss";

import Header from "components/appointment/Header";
import Show from "components/appointment/Show";
import Empty from "components/appointment/Empty";
import useVisualMode from "hooks/useVisualMode.js";
import Form from "components/appointment/Form"

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";

  console.log(props);
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={[]}
          onSave={props.onSave}
          onCancel={() => back()}
        />
      )}
    </article>
  );
}
