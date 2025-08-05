export interface SubjectResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: SbjItem[];
}

export interface SbjItem {
    id: string;
    name: string;
    code: string;
    description: string;
}

export interface SubjectFilter {
    name: string[];
    code: string[];
}

export interface CreateOrUpdateSubjectDto {
    name: string;
    code: string;
    description?: string;
}