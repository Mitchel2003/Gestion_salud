/**
 * Convert a `Firebase Timestamp` to object with date properties for read
 * @param {Object} timeStamp - Date from database (Object with seconds and nanoseconds)
 * @returns {Object} - Object with properties (day, month, year, hour, minutes, seconds)
 */
export function timestampToDate({ seconds, nanoseconds }) {
    const date = new Date(seconds * 1000 + nanoseconds / 1e6);
    return {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        hour: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds()
    }
}
/**
 * Function to combine date and time inputs and convert to a timestamp
 * @param {string} date - The date input value (YYYY-MM-DD)
 * @param {string} time - The time input value (HH:MM)
 * @returns {Object} - An object with seconds and nanoseconds
 */
export function getTimestampFromDateTime(date, time) {
    const dateTimeString = `${date}T${time}:00`;
    const dateObj = new Date(dateTimeString);
    const seconds = Math.floor(dateObj.getTime() / 1000);
    const nanoseconds = (dateObj.getTime() % 1000) * 1e6;
    return { seconds, nanoseconds };
}