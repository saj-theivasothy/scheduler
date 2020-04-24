import { useReducer, useEffect } from "react";
import Axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

const DELETE = "DELETE";
const SAVE = "SAVE";
const EDIT = "EDIT";

function updateSpots(state, operation) {
  const days = state.days.map((day) => {
    if (day.name === state.day) {
      const updatedSpots =
        operation === DELETE
          ? day.spots + 1
          : operation === SAVE
          ? day.spots - 1
          : day.spots;

      return { ...day, spots: updatedSpots };
    }
    return day;
  });
  return days;
}

/**
 * @desc compares the interview obj and the interview obj from the corresponding appointment
 * @param obj appointments - all the appointments for a specific day
 * @param number appointmentId - id for the the new/updated/deleted appointment
 * @param obj interview - contains the student and interviewer id
 * @return EDIT/SAVE/DELETE - depending on whether the two objects are equal or not
 */
function getOperation(appointments, appointmentId, interview) {
  for (const appointment in appointments) {
    const booking = appointments[appointment];

    if (appointmentId === booking.id) {
      if (booking.interview && interview) {
        return EDIT;
      } else if (interview && !booking.interview) {
        return SAVE;
      } else if(booking.interview && !interview) {
        return DELETE;
    }
    } 
  }
}

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
    let appointments = state.appointments;
    const appointmentId = action.appointmentId;
    const interview = action.interview ? { ...action.interview } : null;
    
    const operation = getOperation(appointments, appointmentId, interview);

    const days = updateSpots(state, operation);
    
    const appointment = {
      ...state.appointments[appointmentId],
      interview,
    };

    appointments = {
      ...state.appointments,
      [appointmentId]: appointment,
    };

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
    // opens websocket connection on page load
    const webSocket = new WebSocket("ws://localhost:8001");

    webSocket.onopen = () => {
      webSocket.onmessage = (event) => {
        const message = JSON.parse(event.data);

        /** 
         * @desc when a message is received, 
         *  the the dispatch action will be called with the
         *  data received from the websocket server passed as the action object
         */
        if (message.type === SET_INTERVIEW) {
          dispatch({
            type: SET_INTERVIEW,
            appointmentId: message.id,
            interview: message.interview,
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
