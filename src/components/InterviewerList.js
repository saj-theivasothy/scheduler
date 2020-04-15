import React from "react";

import "./InterviewerList.scss";
import InterviewerListItem from "./InterviewerListItem";

export default function InterviewerList(props) {
  const interviewers = props.interviewers.map((interviewer) => {
    return (
        <InterviewerListItem
          name={interviewer.name}
          avatar={interviewer.avatar}
          selected={props.interviewer === interviewer.id}
          setInterviewer={() => props.setInterviewer(interviewer.id)}
        />
    );
  });
  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
      {interviewers}
      </ul>
    </section>
  );
}
