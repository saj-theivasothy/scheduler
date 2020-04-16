export function getAppointmentsForDay(state, day) {
  const appointmentsForDay = [];

  if (state.days.length === 0) return appointmentsForDay;

  const matchedDay = state.days.filter(
    (filteredDay) => filteredDay.name === day
  );

  if (matchedDay.length === 0) return [];

  const appointmentsList = Object.values(state.appointments);
  const appointmentIds = matchedDay[0].appointments;

  appointmentIds.forEach((id) => {
    const appointment = appointmentsList.filter(
      (appointment) => appointment.id === id
    );

    appointmentsForDay.push(appointment[0]);
  });
  return appointmentsForDay;
}

export function getInterview (state, interview) {
  if(!interview) return null;

  const interviewerId = interview.interviewer.toString();
  if(interviewerId in state.interviewers) {
    const interviewWithInterviewer = {...interview, interviewer: state.interviewers[interviewerId]};
    return interviewWithInterviewer;
  }
} 
