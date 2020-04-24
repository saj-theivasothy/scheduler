import { useReducer, useEffect } from "react";
import Axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

const DELETE = "DELETE";
const SAVE = "SAVE";
const EDIT = "EDIT";

function updateSpots(state, action) {
  const days = state.days.map((day) => {
    if (day.name === state.day) {

      const updatedSpots =
        action === DELETE
          ? day.spots + 1
          : action === SAVE
          ? day.spots - 1
          : day.spots;

      return { ...day, spots: updatedSpots };
    }
    return day;
  });
  return days;
}

function reducer(state, action) {
  const appointments = state.appointments;
  let operation;
  for (const appointment in appointments) {
    const booking = appointments[appointment];

    if (action.appointmentId === booking.id && booking.interview) {
      if (Object.keys(booking.interview).length > 0 && action.interview) {
        operation = EDIT;
      } else if (Object.keys(booking.interview).length === 0) {
        operation = SAVE;
      }
    }
  }
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
    const appointment = {
      ...state.appointments[action.appointmentId],
      interview: { ...action.interview },
    };

    const appointments = {
      ...state.appointments,
      [action.appointmentId]: appointment,
    };

    const days = action.DELETE
      ? updateSpots(state, DELETE)
      : operation === SAVE
      ? updateSpots(state, SAVE)
      : operation === EDIT
      ? updateSpots(state, EDIT)
      : state.days;

    return { ...state, appointments: appointments, days: days };
  }
}

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => dispatch({ type: SET_DAY, day });

  useEffect(() => {
    const webSocket = new WebSocket("ws://localhost:8001");
    webSocket.onopen = () => {
      webSocket.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.type === SET_INTERVIEW && message.interview) {

          dispatch({
            type: SET_INTERVIEW,
            appointmentId: message.id,
            interview: message.interview,
          });
        } else if (message.type === SET_INTERVIEW && !message.interview) {

          dispatch({
            type: SET_INTERVIEW,
            appointmentId: message.id,
            interview: message.interview,
            DELETE,
          });
        }

      };

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
    };
  }, []);

  function bookInterview(appointmentId, interview) {
    return Axios.put(`/api/appointments/${appointmentId}`, {
      interview: interview,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw Error(err);
      });
  }

  function cancelInterview(appointmentId) {
    return Axios.delete(`/api/appointments/${appointmentId}`, {
      interview: null,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw Error(err);
      });
  }

  return { state, setDay, bookInterview, cancelInterview };
}
