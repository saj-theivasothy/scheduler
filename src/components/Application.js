import React from "react";

import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "components/appointment";
import useApplicationData from "hooks/useApplicationData";
import {
  getAppointmentsForDay,
  getInterview,
  getInterviewersForDay,
} from "helpers/selectors";

export default function Application(props) {
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  } = useApplicationData();

  const { day, days, interviewers, appointments } = state;

  const appointmentsForDay = getAppointmentsForDay(days, appointments, day);
  const interviewersForDay = getInterviewersForDay(days, interviewers, day);

  // returns an array of appointment components
  const schedule = appointmentsForDay.map((appointment) => {
    // 
    const interview = getInterview(state.interviewers, appointment.interview);
    const appointmentWithInterview = { ...appointment, interview };
    return (
      <Appointment
        key={appointment.id}
        {...appointmentWithInterview}
        interviewers={interviewersForDay}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
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
        {schedule}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
