import {
  getEntriesForDay,
  getInterview,
} from "helpers/selectors";

const state = {
  days: [
    {
      id: 1,
      name: "Monday",
      appointments: [1, 2, 3],
      interviewers: [1, 2, 3],
    },
    {
      id: 2,
      name: "Tuesday",
      appointments: [4, 5],
      interviewers: [3, 4, 5],
    },
  ],
  appointments: {
    "1": { id: 1, time: "12pm", interview: null },
    "2": { id: 2, time: "1pm", interview: null },
    "3": {
      id: 3,
      time: "2pm",
      interview: { student: "Archie Cohen", interviewer: 2 },
    },
    "4": { id: 4, time: "3pm", interview: null },
    "5": {
      id: 5,
      time: "4pm",
      interview: { student: "Chad Takahashi", interviewer: 2 },
    },
  },
  interviewers: {
    "1": {
      id: 1,
      name: "Sylvia Palmer",
      avatar: "https://i.imgur.com/LpaY82x.png",
    },
    "2": {
      id: 2,
      name: "Tori Malcolm",
      avatar: "https://i.imgur.com/Nmx0Qxo.png",
    },
    "3": {
      id: 3,
      name: "Mildred Nazir",
      avatar: "https://i.imgur.com/T2WwVfS.png",
    },
    "4": {
      id: 4,
      name: "Cohana Roy",
      avatar: "https://i.imgur.com/FK8V841.jpg",
    },
    "5": {
      id: 5,
      name: "Sven Jones",
      avatar: "https://i.imgur.com/twYrpay.jpg",
    },
  },
};

test("getEntriesForDay returns an array", () => {
  const result = getEntriesForDay(state.days, state.appointments, "Monday", "appointments");
  expect(Array.isArray(result)).toBe(true);
});

test("getEntriesForDay returns an array with a length matching the number of appointments for that day", () => {
  const result = getEntriesForDay(state.days, state.appointments, "Monday", "appointments");
  expect(result.length).toEqual(3);
});

test("getEntriesForDay returns an array containing the correct appointment objects", () => {
  const [first, second] = getEntriesForDay(state.days, state.appointments, "Tuesday", "appointments");
  expect(first).toEqual(state.appointments["4"]);
  expect(second).toEqual(state.appointments["5"]);
});

test("getEntriesForDay returns an empty array when the days data is empty", () => {
  const result = getEntriesForDay([], state.appointments, "Monday", "appointments");
  expect(result.length).toEqual(0);
});

test("getEntriesForDay returns an empty array when the day is not found", () => {
  const result = getEntriesForDay(state.days, state.appointments, "Wednesday", "appointments");
  expect(result.length).toEqual(0);
});

test("getInterview returns an object with the interviewer data", () => {
  const result = getInterview(state.interviewers, state.appointments["3"].interview);
  expect(result).toEqual(
    expect.objectContaining({
      student: expect.any(String),
      interviewer: expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        avatar: expect.any(String),
      }),
    })
  );
});

test("getInterview returns null if no interview is booked", () => {
  const result = getInterview(state.interviewers, state.appointments["2"].interview);
  expect(result).toBeNull();
});

test("getEntriesForDay returns an array", () => {
  const result = getEntriesForDay(state.days, state.interviewers, "Monday", "interviewers");
  expect(Array.isArray(result)).toBe(true);
});

test("getEntriesForDay returns an array with a length matching the number of appointments for that day", () => {
  const result = getEntriesForDay(state.days, state.interviewers, "Monday", "interviewers");
  expect(result.length).toEqual(3);
});

test("getEntriesForDay returns an array containing the correct appointment objects", () => {
  const [first, second, third] = getEntriesForDay(state.days, state.interviewers, "Tuesday", "interviewers");
  expect(first).toEqual(state.interviewers["3"]);
  expect(second).toEqual(state.interviewers["4"]);
  expect(third).toEqual(state.interviewers["5"]);
});

test("getEntriesForDay returns an empty array when the days data is empty", () => {
  const result = getEntriesForDay([], state.interviewers, "Monday", "interviewers");
  expect(result.length).toEqual(0);
});

test("getEntriesForDay returns an empty array when the day is not found", () => {
  const result = getEntriesForDay(state.days, state.interviewers, "Wednesday", "interviewers");
  expect(result.length).toEqual(0);
});
