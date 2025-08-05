export interface RoleFeature {
  // id: string;
  // featureName: string;
}

export interface RoleItem {
  id: string;
  name: string;
  description: string;
  roleFeatures: RoleFeature[];
}

export interface RoleListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RoleItem[];
}