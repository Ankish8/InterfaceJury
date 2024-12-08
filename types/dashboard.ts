export interface Student {
  id: number;
  name: string;
  uiDesign: number;
  userResearch: number;
  prototype: number;
  kitKatPoints: number;
  total: number;
  comment: string;
  lastModified?: string;
}

export interface StudentMarks extends Student {}

export interface DashboardProps {
  students: Student[];
}
