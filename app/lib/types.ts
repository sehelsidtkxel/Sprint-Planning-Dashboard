export interface SprintItem {
  id: string;
  phase: string;
  category: string;
  resources: string;
  tasks: string;
  features: string;
  impacted: string;
  notes: string;
  status: string;
}

export interface Sprint {
  id: string;
  title: string;
  version: string;
  sprintDates: string;
  releaseDate: string;
  releaseStatus: string;
  status: string;
  items: SprintItem[];
}

export interface Stream {
  id: string;
  name: string;
  color: string;
  sprints: Sprint[];
}

export interface DashboardData {
  lastUpdated: string;
  streams: Stream[];
}
