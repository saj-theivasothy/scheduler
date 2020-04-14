import React from "react";
import Classnames from "classnames";

import "./InterviewerListItem.scss";

export default function (props) {
  const hidden = !props.selected && "interviewers__item--text--hidden";
  const interviewerClass = Classnames("interviewers__item", {
    "interviewers__item--selected": props.selected,
  });

  return (
    <li
      className={interviewerClass}
      onClick={() => props.setInterviewer(props.name)}
    >
      <img
        className="interviewers__item-image"
        src={props.avatar}
        alt={props.name}
      />
      <span className={hidden}>{props.name}</span>
    </li>
  );
}
