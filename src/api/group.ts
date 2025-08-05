import { UniqueIdentifier } from "@dnd-kit/core";
import axiosInstance, { endpoints } from "src/lib/axios";
import { StudyGroupDTO, StudyGroupItem, StudyGroupResponse, studyGroupUpdateDTO } from "src/types/studyGroup";

export async function getStudyGroups(params?: string): Promise<StudyGroupResponse> {
    const URL = endpoints.studyGroup(params);
    const { data } = await axiosInstance.get<StudyGroupResponse>(URL);
    return data;
}

export async function getStudyGroupById(id: string): Promise<StudyGroupItem> {
    const URL = endpoints.studyGroup(`/${id}`);
    const { data } = await axiosInstance.get<StudyGroupItem>(URL);
    return data;
}

export async function createStudyGroup(body: StudyGroupDTO) {
    const URL = endpoints.studyGroup('');
    const { data } = await axiosInstance.post(URL, body);
    return data;
}

export async function updateStudyGroup(id: UniqueIdentifier, body: studyGroupUpdateDTO) {
    const URL = endpoints.studyGroup(`/${id}`);
    const { data } = await axiosInstance.patch(URL, body);
    return data;
}

export async function deleteStudyGroup(id: UniqueIdentifier) {
    const URL = endpoints.studyGroup(`/${id}`);
    const { data } = await axiosInstance.delete(URL);
    return data;
}