export function getAppointmentsForDay(days, appointments, dayOfWeek) {
  if (days.length === 0) return [];

  let appointmentIdsForDay;

  for (const day of days) {
    if (day.name === dayOfWeek) {
      appointmentIdsForDay = day.appointments;
    }
  }

  if (!appointmentIdsForDay) return [];

  const appointmentsForDay = [];

  appointmentIdsForDay.forEach((appointmentId) => {
    if (appointmentId in appointments) {
      appointmentsForDay.push(appointments[appointmentId]);
    }
  });

  return appointmentsForDay;
}

export function getInterview(interviewers, interview) {
  if (!interview) return null;

  const interviewerId = interview.interviewer;
  if (interviewerId in interviewers) {
    const interviewWithInterviewer = {
      ...interview,
      interviewer: interviewers[interviewerId],
    };
    return interviewWithInterviewer;
  }
}

export function getInterviewersForDay(days, interviewers, dayOfWeek) {
  console.log(days)
  console.log(interviewers)
  if (days.length === 0) return [];

  let interviewerIdsForDay;
  for (const day of days) {
    if (day.name === dayOfWeek) {
      interviewerIdsForDay = day.interviewers;
    }
  }

  if (!interviewerIdsForDay) return [];

  const interviewersForDay = [];
  interviewerIdsForDay.forEach((interviewerId) => {
    if (interviewerId in interviewers) {
      interviewersForDay.push(interviewers[interviewerId]);
    }
  });
  return interviewersForDay;
}
