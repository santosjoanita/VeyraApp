export interface DashboardMetrics {
  clients: {
    total: number;
    active: number;
  };
  projects: {
    total: number;
    active: number;
  };
  workers: {
    total: number;
    active: number;
  };
}
