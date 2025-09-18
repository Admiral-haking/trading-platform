export function getTime(date: number | string) {
    const timestamp = typeof date === 'number' ? date : new Date(date).getTime()
    const secs = (Date.now() - timestamp) / 1e3;

    if (secs < 180) return "Just Now"

    const mins = secs / 60;

    if (mins < 60) return `${Math.trunc(mins)} Minute(s) ago`;

    const hours = mins / 60;

    if (hours < 24) return `${Math.trunc(hours)} Hour(s) ago`;

    const days = hours / 24;

    if (days < 30) return `${Math.trunc(days)} Days(s) ago`;

    return `${Math.trunc(days / 30)} Month(s) ago`;
}