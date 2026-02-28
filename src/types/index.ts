export interface OpenAlexAuthor {
  id: string;
  display_name: string;
  works_count: number;
  cited_by_count: number;
  summary_stats: {
    h_index: number;
    i10_index: number;
    "2yr_mean_citedness": number;
  };
  last_known_institutions: {
    id: string;
    display_name: string;
    country_code: string;
    type: string;
  }[];
  topics: {
    id: string;
    display_name: string;
    count: number;
    subfield: { id: string; display_name: string };
    field: { id: string; display_name: string };
    domain: { id: string; display_name: string };
  }[];
  ids: {
    openalex: string;
    orcid?: string;
    scopus?: string;
  };
  works_api_url: string;
  updated_date: string;
}

export interface OpenAlexWork {
  id: string;
  title: string;
  publication_year: number;
  cited_by_count: number;
  doi: string | null;
  primary_location: {
    source: {
      display_name: string;
    } | null;
  } | null;
  open_access: {
    is_oa: boolean;
    oa_url: string | null;
  };
  authorships: {
    author: {
      id: string;
      display_name: string;
    };
    institutions: {
      display_name: string;
    }[];
  }[];
  topics: {
    id: string;
    display_name: string;
  }[];
}

export interface OpenAlexTopic {
  id: string;
  display_name: string;
  description: string;
  works_count: number;
  cited_by_count: number;
  subfield: { id: string; display_name: string };
  field: { id: string; display_name: string };
  domain: { id: string; display_name: string };
}

export interface SearchFilters {
  country?: string;
  minCitations?: number;
  minWorks?: number;
  sortBy?: "cited_by_count" | "works_count" | "relevance";
}

export interface Professor {
  id: string;
  name: string;
  institution: string;
  country: string;
  countryCode: string;
  department: string;
  topics: { name: string; id: string }[];
  hIndex: number;
  worksCount: number;
  citedByCount: number;
  orcid: string | null;
  openAlexUrl: string;
}

export interface GraphNode {
  id: string;
  name: string;
  institution: string;
  country: string;
  hIndex: number;
  citedByCount: number;
  worksCount: number;
  domain: string;
  field: string;
  topics: { name: string; count: number }[];
  val: number;
}

export interface GraphLink {
  source: string;
  target: string;
  weight: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}
