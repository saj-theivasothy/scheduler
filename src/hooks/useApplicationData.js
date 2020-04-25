import { useReducer, useEffect } from "react";
import Axios from "axios";
import {
  reducer,
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW,
} from "helpers/helpers";

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
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

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

      /** makes requests to the endpoints on page load and
       *  calls the dispatch function with the data received
       */
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
