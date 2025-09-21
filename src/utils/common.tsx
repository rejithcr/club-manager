export const sleep = (ms: number | undefined) => new Promise((r) => setTimeout(r, ms));

export const getQuarter = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.getMonth();
  const quarter = Math.floor(month / 3) + 1;
  return `Q${quarter}`;
};

const month = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

export const getMonth = (dateString: string) => {
  const d = new Date(dateString);
  return month[d.getMonth()];
};

export const getYear = (dateString: string) => {
  const d = new Date(dateString);
  return d.getFullYear();
};

export const getMonths = (year: number) => {
  const months = [];

  for (let month = 0; month < 12; month++) {
    const date = new Date(year, month, 1);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // month is 0-based
    const dd = "01";
    months.push({
      period: date.toLocaleString("default", { month: "long" }).substring(0, 3).toUpperCase(),
      startDate: `${yyyy}-${mm}-${dd}`,
    });
  }
  return months;
};

export const getQuarters = (year: number) => {
  const quarters = [];

  for (let i = 0; i < 4; i++) {
    const month = i * 3; // 0, 3, 6, 9
    const date = new Date(year, month, 1);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // month is 0-based
    const dd = "01";
    quarters.push({
      period: `Q${i + 1}`,
      startDate: `${yyyy}-${mm}-${dd}`,
    });
  }

  return quarters;
};

export const getCurrentMonthItem = (months: { period: string; startDate: string }[] | undefined) => {
  const currentMonthIndex = new Date().getMonth(); // 0-based index
  return months && months[currentMonthIndex];
};

export const getCurrentQuarterItem = (quarters: { period: string; startDate: string }[] | undefined) => {
  const currentMonth = new Date().getMonth();
  const currentQuarterIndex = Math.floor(currentMonth / 3); // 0-based index
  return quarters && quarters[currentQuarterIndex];
};

export const jsonToCSV = (jsonArray: any[]) => {
  if (!jsonArray.length) return "";

  const headers = Object.keys(jsonArray[0]);
  const csvRows = [];

  // Add headers
  csvRows.push(headers.join(","));

  // Add rows
  for (const obj of jsonArray) {
    const values = headers.map((header) => {
      let val = obj[header];
      // Escape quotes and wrap in quotes if needed
      if (typeof val === "string") {
        val = val.replace(/"/g, '""');
        if (val.search(/("|,|\n)/g) >= 0) {
          val = `"${val}"`;
        }
      }
      return val;
    });
    csvRows.push(values.join(","));
  }

  return csvRows.join("\n");
};

export const handleTimeChange = (text: string, setState: React.Dispatch<React.SetStateAction<string>>) => {
  const raw = text.replace(/[^0-9]/g, "");
  let formatted = "";
  if (raw.length <= 2) {
    formatted = raw;
  } else {
    formatted = raw.slice(0, 2) + ":" + raw.slice(2, 4);
  }
  setState(formatted);
};

export const to24HourFormat = (time12h: string) => {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier.toLowerCase() === "pm" && hours !== 12) {
    hours += 12;
  }
  if (modifier.toLowerCase() === "am" && hours === 12) {
    hours = 0;
  }

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}