import { UserType } from "src/auth/types";
import axiosInstance, { endpoints } from "src/lib/axios";
import { IChatConversation } from "src/types/chat";
import { CreateOrUpdateUserDto, UserItem, UserResponse } from "src/types/user";
import useSWR from "swr";

export async function getUsers(params?: string): Promise<UserResponse> {
    const URL = endpoints.users.list(params);
    const { data } = await axiosInstance.get<UserResponse>(URL);
    return data;
}

export async function getUser(id: string): Promise<UserItem> {
    const URL = endpoints.users.byId(id);
    const { data } = await axiosInstance.get<UserItem>(URL);
    return data;
}

export async function createUser(bodyPayload: CreateOrUpdateUserDto) {
    const URL = endpoints.users.list('');
    const { data } = await axiosInstance.post(URL, bodyPayload);
    return data;
}

export async function updateUser(id: string, bodyPayload: CreateOrUpdateUserDto) {
    const URL = endpoints.users.byId(id);
    const { data } = await axiosInstance.patch(URL, bodyPayload);
    return data;
}

interface UseLastSenderNameProps {
  conversation: IChatConversation;
  currentUser?: UserType;
}
export function useLastSenderName({ conversation, currentUser }: UseLastSenderNameProps) {
  const lastMessage =
    Array.isArray(conversation.messages) && conversation.messages.length > 0
      ? conversation.messages[conversation.messages.length - 1]
      : undefined;

  const shouldFetch =
    !!lastMessage?.senderId && lastMessage.senderId !== currentUser?.id;

  const { data, error, isLoading } = useSWR(
    shouldFetch ? ['last-sender-name', lastMessage.senderId] : null,
    () =>
      getUser(lastMessage!.senderId).then((user) => user.lastName)
  );

  return {
    lastSenderName: data,
    isLoading,
    isError: !!error,
  };
}