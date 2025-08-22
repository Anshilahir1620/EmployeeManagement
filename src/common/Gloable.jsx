export default function formatDateToDDMMYYYY(date) {
    const datefns = new Date(`${date}`)
    const day = datefns.getDate().toString().padStart(2, '0');
    const month = (datefns.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based, so we add 1.
    const year = datefns.getFullYear();

    return `${day}/${month}/${year}`;
}
export const formatDateToDDMMYYYYTime = (date) => {
    const datefns = new Date(`${date}`)
    const day = datefns.getDate().toString().padStart(2, '0');
    const month = (datefns.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based, so we add 1.
    const year = datefns.getFullYear();

    const Hours = datefns.getHours();
    const Min = datefns.getMinutes();

    return `${day}/${month}/${year} ${Hours}:${Min}`;
}


export const env = process.env.PUBLIC_URL
export const PROJECT_NAME = "FitRace"

// Staging
export const BASEURL = "https://absolutewebservices.in/fitrace/staging/api/public/v1"
export const token = ""




