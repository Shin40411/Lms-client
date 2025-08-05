import axiosInstance, { endpoints } from "src/lib/axios";
import { RoleListResponse } from "src/types/role";

export async function getRoles(): Promise<RoleListResponse> {
    const URL = endpoints.roles.list;
    const { data } = await axiosInstance.get<RoleListResponse>(URL);
    return data;
}