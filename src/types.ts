// ============================================================
// types.ts — All TypeScript interfaces for the report
// ============================================================

export type CategoryId =
  | 'all'
  | 'background'
  | 'objective'
  | 'benefit'
  | 'agent'
  | 'mcp'
  | 'context'
  | 'maps'
  | 'builder'
  | 'mcp-exp'
  | 'app'
  | 'compare'
  | 'impact'
  | 'challenge';

export interface FilterPill {
  id: CategoryId;
  label: string;
  count?: number;
}

export interface CodeExample {
  lang: string;
  label?: string;
  code: string;
}

export interface ContentRow {
  id: string;
  category: CategoryId;
  tag: string;
  title: string;
  subtitle?: string;
  body: string;
  list?: string[];
  code?: CodeExample;
  badge?: string;
  badgeVariant?: 'pos' | 'neg' | 'warn' | 'neutral';
  colLeft?: string;
  colRight?: string;
  chips?: string[];
  components?: ComponentItem[];
  mcpFlow?: McpNode[];
}

export interface ComponentItem {
  icon: string;
  name: string;
  desc: string;
}

export interface McpNode {
  label: string;
  sublabel: string;
  highlight?: boolean;
}

export interface ChapterData {
  id: string;
  num: string;
  title: string;
  desc: string;
  pills: FilterPill[];
  rows: ContentRow[];
  compareMode?: boolean;  // ch4 uses Rule-Based vs Agentic columns
}

export interface Finding {
  value: string;
  label: string;
}

export interface Author {
  name: string;
  studentId: string;
  initials: string;
}

export interface ReportMeta {
  title: string;
  subtitle: string;
  course: string;
  semester: string;
  authors: Author[];
  advisor: string;
  tags: string[];
}
