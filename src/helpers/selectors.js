/**
 * using the entry ids from the days obj,
 * returns the entries for the given day
 */
export function getEntriesForDay(days, entries, dayOfWeek, entry) {
  if (days.length === 0) return [];
  
  const selectedDay = days.find(day => day.name === dayOfWeek)

  if (!selectedDay) return [];

  const entryIdsForDay = selectedDay[entry];

  const entriesForDay = [];

  entryIdsForDay.forEach((entryId) => {
    if (entryId in entries) {
      entriesForDay.push(entries[entryId]);
    }
  });

  return entriesForDay;
}

/**
 * using the interviewer id stored in the interview object,
 * returns the interview with interviewer data
 */
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

