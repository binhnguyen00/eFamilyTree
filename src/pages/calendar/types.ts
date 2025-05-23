export interface Event {
  id: number;
  name: string;
  note: string;
  pic: string;
  picId: number;
  fromDate: string; // Format: "DD/MM/YYYY"
  toDate: string; // Format: "DD/MM/YYYY"
  place: string;
  address: string;
}

export enum CalendarView {
  MONTH = "month",
  YEAR = "year"
}