export interface CreateHallOfFameForm {
  typeId: number; // hall of fame type id
  memberId: number;
  recognitionDate?: string;
  achievement?: string;
}