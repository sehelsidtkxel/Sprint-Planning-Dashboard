export interface SprintTask {
  id?: string;
  stream_id?: string;
  title?: string;
  start_date?: string;
  end_date?: string;
  release_date?: string;
  phase: string;
  category: string;
  resources: string;
  task: string;
  feature: string;
  comments: string;
  status: string;
  streams?: {
    name: string;
    color: string;
  };
}