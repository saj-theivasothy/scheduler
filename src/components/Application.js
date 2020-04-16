import React, { useState, useEffect } from "react";
import Axios from "axios";

import "components/Application.scss";
import DayList from "./DayList";
import InterviewerList from "./InterviewerList";
import Appointment from "components/appointment";

const appointments = [
  {
    id: 1,
    time: "12pm",
  },
  {
    id: 2,
    time: "1pm",
    interview: {
      student: "Lydia Miller-Jones",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      },
    },
  },
  {
    id: 3,
    time: "2pm",
    interview: {
      student: "Alexander Lacazette",
      interviewer: {
        id: 3,
        name: "Mildred Nazir",
        avatar: "https://i.imgur.com/T2WwVfS.png",
      },
    },
  },
  {
    id: 4,
    time: "3pm",
  },
  {
    id: 5,
    time: "4pm",
    interview: {
      student: "Grenit Xhaka",
      interviewer: {
        id: 5,
        name: "Sven Jones",
        avatar: "https://i.imgur.com/twYrpay.jpg",
      },
    },
  },
];
export default function Application(props) {
  
  const [ state, setState ] = useState({
    day: "Monday",
    days: [],
    appointments: {},
  });

  const { day, days, appointments } = state;

  const setDay = (day) => setState({ ...state, day });

  const appointmentsList = Object.values(appointments).map((appointment) => {
    return <Appointment key={appointment.id} {...appointment} />;
  });

  useEffect(() => {
    Promise.all([
      Axios.get("http://localhost:8001/api/days"),
      Axios.get("http://localhost:8001/api/appointments")
    ])
    .then((all) => {
      setState(prev => ({days: all[0].data, appointments: all[1].data}))
      
    })
    .catch((err) => console.error(err));
  }, []);

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList {...{ days, day, setDay }} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointmentsList}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
