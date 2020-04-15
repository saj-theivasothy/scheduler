export function getAppointmentsForDay(state, day) {
  const appointmentsForDay = [];
  const appointmentsList = Object.values(state.appointments);

  console.log(appointmentsList);

  const appointmentIds = state.days.filter(
    (filteredDay) => filteredDay.name === day
  )[0].appointments;

  appointmentIds.forEach((id) => {
    const appointment = appointmentsList.filter(
      (appointment) => appointment.id === id
    )[0];

    appointmentsForDay.push(appointment);
  });

  return appointmentsForDay;
}
