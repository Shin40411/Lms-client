import { UniqueIdentifier } from "@dnd-kit/core";
import axiosInstance, { endpoints } from "src/lib/axios";
import { ChannelDTO, ChannelItem, ChannelResponse } from "src/types/channel";
import { UserResponse } from "src/types/user";

export async function getChannels(params?: string[]): Promise<ChannelResponse> {
    const queries = params?.join(',');
    const URL = endpoints.channel(queries ? queries : '');
    const { data } = await axiosInstance.get<ChannelResponse>(URL);
    return data;
}

export async function createChannels(body: ChannelDTO) {
    const URL = endpoints.channel('');
    const { data } = await axiosInstance.post(URL, body);
    return data;
}

export async function updateChannel(id: string, body: ChannelDTO) {
    const URL = endpoints.channel(`/${id}`);
    const { data } = await axiosInstance.patch(URL, body);
    return data;
}

export async function getChannel(id: string) {
    const URL = endpoints.channel(`/${id}`);
    const { data } = await axiosInstance.get<ChannelItem>(URL);
    return data;
}

export async function getUserInChannelExcludeGroup(id: string, groupId: UniqueIdentifier, query: string): Promise<UserResponse> {
    const URL = endpoints.availableUsers(id, groupId, query);
    const { data } = await axiosInstance.get<UserResponse>(URL);
    return data;
}

export async function deleteChannel(id: string) {
    const URL = endpoints.channel(`/${id}`);
    const { data } = await axiosInstance.delete(URL);
    return data;
}