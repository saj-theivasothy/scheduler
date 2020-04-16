import React, { useState, useEffect } from "react";
import Axios from "axios";

import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "components/appointment";
import getAppointmentsForDay from "helpers/selectors";


export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
  });

  const { day, days } = state;

  const setDay = (day) => setState({ ...state, day });

  
  useEffect(() => 
  {Promise.all([
    Axios.get("http://localhost:8001/api/days"),
    Axios.get("http://localhost:8001/api/appointments"),
  ])
  .then((all) => {
    setState((prev) => ({days: all[0].data, appointments: all[1].data }));
  })
      .catch((err) => console.error(err)); 
    }, []);
    
    const appointmentsForDay = getAppointmentsForDay(state, day)
      const appointmentsList = appointmentsForDay.map((appointment) => {
        return <Appointment key={appointment.id} {...appointment} />;
      });

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
