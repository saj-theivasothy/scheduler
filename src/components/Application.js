import React, { useState, useEffect } from "react";
import Axios from "axios";

import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "components/appointment";
import {
  getAppointmentsForDay,
  getInterview,
  getInterviewersForDay,
} from "helpers/selectors";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const { day, days } = state;

  const setDay = (day) => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      Axios.get("http://localhost:8001/api/days"),
      Axios.get("http://localhost:8001/api/appointments"),
      Axios.get("http://localhost:8001/api/interviewers"),
    ])
      .then((all) => {
        setState((prev) => ({
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data,
        }));
      })
      .catch((err) => console.error(err));
  }, []);

  const appointmentsForDay = getAppointmentsForDay(state, day);
  const interviewersForDay = getInterviewersForDay(state, day);

  function bookInterview(appointmentId, interview) {
    const appointment = {
      ...state.appointments[appointmentId],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [appointmentId]: appointment,
    };

    return Axios.put(
      `http://localhost:8001/api/appointments/${appointmentId}`,
      { interview: interview }
    )
      .then((res) => {
        setState({ ...state, appointments: appointments });
        return res;
      })
      .catch((err) => err);
  }

  function cancelInterview(appointmentId) {
    const appointment = {
      ...state.appointments[appointmentId],
      interview: null,
    };
    const appointments = {
      ...state.appointments,
      [appointmentId]: appointment,
    };

    return Axios.delete(
      `http://localhost:8001/api/appointments/${appointmentId}`,
      { interview: null }
    )
      .then((res) => {
        setState({ ...state, appointments: appointments });
        return res;
      })
      .catch((err) => err);
  }

  const schedule = appointmentsForDay.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
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
