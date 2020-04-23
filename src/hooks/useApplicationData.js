import { useReducer, useEffect } from "react";
import Axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  function reducer(state, action) {
    if (action.type === SET_DAY) {
      return { ...state, day: action.day };
    }
    if (action.type === SET_APPLICATION_DATA) {
      return {
        ...state,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers,
      };
    }
    if (action.type === SET_INTERVIEW) {
      return { ...state, appointments: action.appointments, days: action.days };
    }
  }

  const setDay = (day) => dispatch({ type: SET_DAY, day });

  useEffect(() => {
    Promise.all([
      Axios.get("/api/days"),
      Axios.get("/api/appointments"),
      Axios.get("/api/interviewers"),
    ])
      .then((all) => {
        const days = all[0].data;
        const appointments = all[1].data;
        const interviewers = all[2].data;

        dispatch({
          type: SET_APPLICATION_DATA,
          days,
          appointments,
          interviewers,
        });
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

    return Axios.put(`/api/appointments/${appointmentId}`, {
      interview: interview,
    })
      .then((res) => {
        const days = edit ? updateSpots("edit") : updateSpots("save");
       
        dispatch({ type: SET_INTERVIEW, appointments, days });
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

    return Axios.delete(`/api/appointments/${appointmentId}`, {
      interview: null,
    })
      .then((res) => {
        const days = updateSpots("delete");
        dispatch({ type: SET_INTERVIEW, appointments, days });
        return res;
      })
      .catch((err) => {
        throw Error(err);
      });
  }

  return { state, setDay, bookInterview, cancelInterview };
}
