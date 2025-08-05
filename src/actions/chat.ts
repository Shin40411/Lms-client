import type { SWRConfiguration } from 'swr';
import type { IChatMessage, IChatParticipant, IChatConversation, IChatBodySender } from 'src/types/chat';

import { useEffect, useMemo } from 'react';
import { keyBy } from 'es-toolkit';
import useSWR, { mutate } from 'swr';

import axios, { fetcher, endpoints } from 'src/lib/axios';
import axiosInstance from 'src/lib/axios';
import { socketChat } from 'src/lib/socket';
import { SOCKET_INCOMING_EVENTS } from 'src/constants/socket-events';

// ----------------------------------------------------------------------

const enableServer = false;

const CHART_ENDPOINT = 'https://api-dev-minimal-v700.pages.dev/api/chat';

const swrOptions: SWRConfiguration = {
  revalidateIfStale: enableServer,
  revalidateOnFocus: enableServer,
  revalidateOnReconnect: enableServer,
};

// ----------------------------------------------------------------------

type ContactsData = {
  contacts: IChatParticipant[];
};

export function useGetContacts() {
  const url = [CHART_ENDPOINT, { params: { endpoint: 'contacts' } }];

  const { data, isLoading, error, isValidating } = useSWR<ContactsData>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      contacts: data?.contacts || [],
      contactsLoading: isLoading,
      contactsError: error,
      contactsValidating: isValidating,
      contactsEmpty: !isLoading && !isValidating && !data?.contacts.length,
    }),
    [data?.contacts, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type ConversationsData = {
  count: number;
  next: string | null;
  previous: string | null;
  results: IChatConversation[];
};

export function useGetConversations() {
  const url = endpoints.conversation.list;

  const { data, isLoading, error, isValidating } = useSWR<ConversationsData>(
    url,
    fetcher,
    swrOptions
  );

  const memoizedValue = useMemo(() => {
    const byId = data?.results?.length ? keyBy(data.results, (option) => option.id) : {};
    const allIds = Object.keys(byId);

    return {
      conversations: { byId, allIds },
      conversationsLoading: isLoading,
      conversationsError: error,
      conversationsValidating: isValidating,
      conversationsEmpty: !isLoading && !isValidating && !allIds.length,
    };
  }, [data?.results, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

type ConversationData = IChatConversation;

export function useGetConversation(conversationId: string) {
  const url = conversationId
    ? endpoints.conversation.byId(conversationId)
    : '';

  const { data, isLoading, error, isValidating } = useSWR<ConversationData>(
    url,
    fetcher,
    swrOptions
  );

  const memoizedValue = useMemo(
    () => ({
      conversation: data,
      conversationLoading: isLoading,
      conversationError: error,
      conversationValidating: isValidating,
      conversationEmpty: !isLoading && !isValidating && !data,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function sendMessage(bodyPayload: IChatBodySender) {
  const URL = endpoints.messages.root;

  const { data: newMessage }: { data: IChatMessage } = await axiosInstance.post(URL, bodyPayload);

  const conversationId = bodyPayload.conversationId;

  mutate(
    endpoints.conversation.byId(conversationId),
    (currentData: IChatConversation | undefined) => {
      if (!currentData) return;

      return {
        ...currentData,
        messages: [...currentData.messages, newMessage],
      };
    },
    false
  );

  mutate(
    endpoints.conversation.list,
    (currentData: { results: IChatConversation[] } | undefined) => {
      if (!currentData) return;

      const updatedResults = currentData.results.map((c) =>
        c.id === conversationId
          ? {
            ...c,
            messages: [...(c.messages || []), newMessage],
            updatedAt: newMessage.createdAt,
            lastMessage: newMessage,
          }
          : c
      );

      return {
        ...currentData,
        results: updatedResults,
      };
    },
    false
  );

  return newMessage;
}

// ----------------------------------------------------------------------

export async function createConversation(conversationData: IChatConversation) {
  const url = [CHART_ENDPOINT, { params: { endpoint: 'conversations' } }];

  /**
   * Work on server
   */
  const data = { conversationData };
  const res = await axios.post(CHART_ENDPOINT, data);

  /**
   * Work in local
   */

  mutate(
    url,
    (currentData: any) => {
      const currentConversations: IChatConversation[] = currentData.conversations;

      const conversations: IChatConversation[] = [...currentConversations, conversationData];

      return { ...currentData, conversations };
    },
    false
  );

  return res.data;
}

// ----------------------------------------------------------------------

export async function clickConversation(conversationId: string) {
  /**
   * Work on server
   */
  // if (enableServer) {
  //   await axios.get(CHART_ENDPOINT, { params: { conversationId, endpoint: 'mark-as-seen' } });
  // }

  /**
   * Work in local
   */

  mutate(
    [CHART_ENDPOINT, { params: { endpoint: 'conversations' } }],
    (currentData) => {
      const currentConversations: IChatConversation[] = currentData.conversations;

      const conversations = currentConversations.map((conversation: IChatConversation) =>
        conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation
      );

      return { ...currentData, conversations };
    },
    false
  );
}

export function useSocketChat(onMessageReceived: (msg: any) => void) {
  useEffect(() => {
    socketChat.connect();

    socketChat.on(SOCKET_INCOMING_EVENTS.MESSAGE_RECEIVED, onMessageReceived);

    return () => {
      socketChat.off(SOCKET_INCOMING_EVENTS.MESSAGE_RECEIVED, onMessageReceived);
      socketChat.disconnect();
    };
  }, [onMessageReceived]);
}