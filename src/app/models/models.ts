export interface Overview {
  totalTraffic: string;
  detected: number;
  accuracy: number;
  activeAlerts: number;
  benignCount?: number;
}

export interface TimeSeries {
  categories: string[];
  series: number[];
}

export interface AttackTypes {
  labels: string[];
  values: number[];
}

export interface AlertItem {
  time: string;
  type: string;
  src: string;
  severity: string;
}

export interface AnalyticsSeries {
  name: string;
  data: number[];
}

export interface HeatmapData {
  days: string[];
  hours: string[];
  matrix: number[][];
}

export interface RadarSeries {
  name: string;
  data: number[];
}

export interface AnalyticsResponse {
  overview: Overview;
  trafficTrend: { categories: string[]; series: AnalyticsSeries[] };
  topAttackLabels: { labels: string[]; values: number[] };
  detectionTrend: { categories: string[]; series: AnalyticsSeries[] };
  heatmap: HeatmapData;
  modelRadar: { labels: string[]; series: RadarSeries[] };
  recentAlerts: AlertItem[];
  severity: { [level: string]: number };
  preferredModel?: ModelInfo;
}

export interface ModelInfo {
  name: string;
  description: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  latency_ms: number;
  status: string;
  featureCount?: number;
  preferred?: boolean;
}

export interface SettingsState {
  darkMode: boolean;
  notificationsEnabled: boolean;
  selectedModel: string;
  models: string[];
  account: {
    username: string;
    email: string;
  };
}