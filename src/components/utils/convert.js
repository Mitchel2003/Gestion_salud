/**
 * Convert a `Firebase Timestamp` to object with date properties for read
 * @param {Object} timeStamp - Date from database (Object with seconds and nanoseconds)
 * @returns {Object} - Object with properties (day, month, year, hour, minutes, seconds)
 */
export function timeStampToDate({ seconds, nanoseconds }) {
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