export interface ExperimentData {
  sampleInfo: string;
  targetSubstance: string;
  currentColumn: string;
  mobilePhase: string;
  gradient: string;
  problem: string;
  imageBase64?: string;
  imageMimeType?: string;
}

export interface AnalysisState {
  isLoading: boolean;
  result: string | null;
  error: string | null;
}