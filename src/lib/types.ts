export type Status = "draft" | "published";

export interface Criterion { name: string; description?: string }
export interface FailureMode { code?: string; name: string; description?: string }
export interface CaseSide { priority?: string; action?: string; why?: string; avoid?: string }
export interface ExperimentCase { id: string; summary: string; human?: CaseSide; ai?: CaseSide }
export interface Source { label: string; url?: string }

export interface Experiment {
  id: string;
  experiment_number: number;
  slug: string;
  title: string;
  subtitle: string | null;
  status: Status;
  publication_date: string | null;
  last_updated: string | null;
  short_summary: string | null;
  research_question: string | null;
  hypothesis: string | null;
  workflow: string | null;
  workflow_steps: string[];
  research_type: string | null;
  methodology: string | null;
  dataset_description: string | null;
  sample_size: number | null;
  human_baseline: string | null;
  ai_baseline: string | null;
  evaluation_criteria: Criterion[];
  results: string | null;
  key_findings: string[];
  failure_modes: FailureMode[];
  observations: string[];
  interpretations: string[];
  unknowns: string[];
  what_changed: string | null;
  limitations: string[];
  conclusion: string | null;
  practical_implications: string[];
  cases: ExperimentCase[];
  related_experiments: string[];
  topics: string[];
  tags: string[];
  featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  author: string;
  sources: Source[];
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export type ExperimentInput = Omit<Experiment, "id" | "created_at" | "updated_at" | "published_at">;

export interface Finding {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  body: string | null;
  source_experiment: string | null;
  evidence: string[];
  topic: string | null;
  date: string | null;
  tags: string[];
  related_findings: string[];
  status: Status;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  experiment?: Pick<Experiment, "id" | "slug" | "title" | "experiment_number"> | null;
}

export interface FieldNote {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  body: string | null;
  date: string | null;
  related_experiments: string[];
  topics: string[];
  tags: string[];
  featured_image: string | null;
  status: Status;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface Topic {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
}

export type ExperimentCard = Pick<
  Experiment,
  "id" | "experiment_number" | "slug" | "title" | "subtitle" | "short_summary" | "topics" | "status" | "publication_date" | "featured"
>;
