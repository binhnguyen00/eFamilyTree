export type TreeMember = {
  id: number;
  code: string;
  name: string;
  gender: "0" | "1";
  phone: string;
  birthday: string;
  lunarDeathDay: string;
  generation: number;
  spouses: {
    id: number;
    name: string;
    gender: "0" | "1";
  }[]
  children: {
    id: number;
    name: string;
  }[]
  father: string;
  fatherId: number;
  mother: string;
  motherId: number;
  achievements: {
    name: string,
    date: string,
    description: string
  }[]
  avatar?: string;
}