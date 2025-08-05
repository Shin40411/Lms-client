import axiosInstance, { endpoints } from "src/lib/axios";
import { CreateOrUpdateSubjectDto, SbjItem, SubjectResponse } from "src/types/subject";

export async function getSubjects(params?: string): Promise<SubjectResponse> {
    const URL = endpoints.subjects.list(params);
    const { data } = await axiosInstance.get<SubjectResponse>(URL);
    return data;
}

export async function getSubjectById(id: string): Promise<SbjItem> {
    const URL = endpoints.subjects.byId(id);
    const { data } = await axiosInstance.get<SbjItem>(URL);
    return data;
}

export async function createSubject(bodyPayload: CreateOrUpdateSubjectDto) {
    const URL = endpoints.subjects.list('');
    const { data } = await axiosInstance.post(URL, bodyPayload);
    return data;
}

export async function updateSubject(id: string, bodyPayload: CreateOrUpdateSubjectDto) {
    const URL = endpoints.subjects.byId(id);
    const { data } = await axiosInstance.patch(URL, bodyPayload);
    return data;
}

export async function deleteSubject(id: string) {
    const URL = endpoints.subjects.byId(id);
    const { data } = await axiosInstance.delete(URL);
    return data;
}