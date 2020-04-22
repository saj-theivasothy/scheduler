import { useState, useEffect } from "react";
import Axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      Axios.get("http://localhost:8001/api/days"),
      Axios.get("http://localhost:8001/api/appointments"),
      Axios.get("http://localhost:8001/api/interviewers"),
    ])
      .then((all) => {
        setState((prev) => ({
          ...prev,
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data,
        }));
      })
      .catch((err) => console.error(err));
  }, []);

  function updateSpots(action) {
    const days = state.days.map((day) => {
      if (day.name === state.day) {
        const updatedSpots =
          action === "save"
            ? day.spots - 1
            : action === "delete"
            ? day.spots + 1
            : day.spots;
        return { ...day, spots: updatedSpots };
      }
      return day;
    });
    return days;
  }

  function bookInterview(appointmentId, interview, edit) {
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
        const days = edit ? updateSpots("edit") : updateSpots("save");
        setState({ ...state, appointments, days });
        return res;
      })
      .catch((err) => {
        throw Error(err);
      });
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
        const days = updateSpots("delete");
        setState({ ...state, appointments, days });
        return res;
      })
      .catch((err) => {
        throw Error(err);
      });
  }

  return { state, setDay, bookInterview, cancelInterview };
}
