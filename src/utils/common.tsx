export const sleep = (ms: number | undefined) => new Promise(r => setTimeout(r, ms));

export const getQuarter = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth();
    const quarter = Math.floor(month / 3) + 1;
    return `Q${quarter}`;
}

const month = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

export const getMonth = (dateString: string) => {
    const d = new Date(dateString);
    return month[d.getMonth()];
}

export const getYear = (dateString: string) => {
    const d = new Date(dateString);
    return d.getFullYear();
}