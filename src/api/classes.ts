import axiosInstance, { endpoints } from "src/lib/axios";
import { ClassListResponse, ClassResponse, CreateOrUpdateClassDto } from "src/types/classes";

export async function getClasses(): Promise<ClassListResponse> {
    const URL = endpoints.classes.list;
    const { data } = await axiosInstance.get<ClassListResponse>(URL);
    return data;
}

export async function searchClasses(key: string): Promise<ClassListResponse> {
    const URL = endpoints.classes.byKey(key);
    const { data } = await axiosInstance.get<ClassListResponse>(URL);
    return data;
}

export async function createClass(bodyPayload: CreateOrUpdateClassDto) {
    const URL = endpoints.classes.list;
    const { data } = await axiosInstance.post(URL, bodyPayload);
    return data;
}

export async function updateClass(id: string, bodyPayload: CreateOrUpdateClassDto) {
    const URL = endpoints.classes.byId(id);
    const { data } = await axiosInstance.patch(URL, bodyPayload);
    return data;
}

export async function getDetails(id: string): Promise<ClassResponse> {
    const URL = endpoints.classes.byId(id);
    const { data } = await axiosInstance.get<ClassResponse>(URL);
    return data;
}

export async function deleteClass(id: string) {
    const URL = endpoints.classes.byId(id);
    const { data } = await axiosInstance.delete(URL);
    return data;
}

export async function filterClasses (field: string, value: any): Promise<ClassListResponse> {
    const URL = endpoints.classes.filter(field, value);
    const { data } = await axiosInstance.get<ClassListResponse>(URL);
    return data;
}