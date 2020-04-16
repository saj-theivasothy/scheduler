export function getAppointmentsForDay(state, dayOfWeek) {
  if (state.days.length === 0) return [];
  
  let appointments;
  for (const day of state.days) {
    if (day.name === dayOfWeek) {
      appointments = day.appointments;
    } 
  }

  if (!appointments) return [];
  
  const appointmentsForDay = [];
  appointments.forEach((appointment) => {
    if(appointment in state.appointments) {
      appointmentsForDay.push(state.appointments[appointment]);
    }
  })

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


// export function getInterviewersForDay (state)