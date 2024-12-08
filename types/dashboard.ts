export interface Student {
  id: number;
  name: string;
  uiDesign: number;
  userResearch: number;
  prototype: number;
  kitKatPoints: number;
  total: number;
  comment: string;
  lastModified: string;
}

export interface DashboardProps {
  students: string[];
}

