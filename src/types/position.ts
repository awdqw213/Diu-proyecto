export type PositionCategory = "catedra" | "corrector" | "laboratorio";

export type PositionStatus = "open" | "closed";

export type Section = "200" | "201";

export interface Position {
  id: string;
  title: string;
  department: string;
  categories?: PositionCategory[];
  status: PositionStatus;
  description: string;
  requirements: string[];
}

export interface Application {
  id: string;
  positionId: string;
  positionTitle: string;
  department: string;
  category?: PositionCategory;
  section: Section;
  reason: string;
  submittedAt: Date;
  status: "pending" | "cancelled";
}
