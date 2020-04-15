import React from "react";

import "./InterviewerList.scss";
import InterviewerListItem from "./InterviewerListItem";

const handleSetInterviewer = (selected, interviewerId, setInterviewer) => {
  selected ? setInterviewer() : setInterviewer(interviewerId);
};
export default function InterviewerList(props) {
  const interviewers = props.interviewers.map((interviewer) => {
    const selected = props.interviewer === interviewer.id;
    return (
      <InterviewerListItem
        name={interviewer.name}
        avatar={interviewer.avatar}
        selected={selected}
        setInterviewer={() =>
          handleSetInterviewer(selected, interviewer.id, props.setInterviewer)
        }
      />
    );
  });
  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{interviewers}</ul>
    </section>
  );
}
