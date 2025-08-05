import { UserItem } from "./user";

export interface ClassListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: ClassItem[];
}

export interface ClassItem {
    id: string;
    name: string;
    description: string;
    grade: string;
    academicYear: string;
    homeroomTeacher: HomeroomTeacher;
    _count: MembersCount;
}

export interface HomeroomTeacher {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    fullName: string;
    dob: string;
    avatar: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER' | string;
    code: string;
    email: string;
    phone: string;
    teacherProfile: TeacherProfile;
}

export interface MembersCount {
    students: number;
    teachers: number;
}

export interface TeacherProfile {
    degree: 'BACHELOR' | 'MASTER' | 'DOCTOR' | string;
}

export type Grade =
  | '1' | '2' | '3' | '4' | '5'
  | '6' | '7' | '8' | '9'
  | '10' | '11' | '12' | 'UNDERGRADUATE';

export interface CreateOrUpdateClassDto {
  name: string;
  description?: string;
  grade: Grade;
  academicYear: string;
  homeroomTeacherId: string;
  students: string[];
  teachers: string[];
}

export interface Teacher {
  user: UserItem & {
    teacherProfile: TeacherProfile;
  };
}

export interface StudentProfile {
  academicYear: string;
}

export interface Student extends UserItem {
  studentProfile: StudentProfile;
}

export interface ClassResponse {
  id: string;
  name: string;
  description: string;
  grade: string;
  teachers: Teacher[];
  students: Student[];
  homeroomTeacher: HomeroomTeacher;
  _count: {
    students: number;
    teachers: number;
  };
}

export type ClassFilters = {
  grade: string[];
};