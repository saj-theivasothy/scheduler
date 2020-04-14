import React from "react";
import Classnames from 'classnames'

import './InterviewerListItem.scss'

export default function (props) {
  const interviewerClass = Classnames("interviewers__item", {
    "interviewers__item--selected": props.selected
  })
  return (
    <li className={interviewerClass} onClick={() => props.setInterviewer(props.name)}>
      <img
        className="interviewers__item-image"
        src={props.avatar}
        alt={props.name}
      />
      {props.name}
    </li>
  );
}
