import { useState, useEffect, useCallback, startTransition, useMemo } from 'react';


import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetConversation, useGetConversations, useSocketConversation } from 'src/actions/chat';

import { EmptyContent } from 'src/components/empty-content';

import { useAuthContext } from 'src/auth/hooks';

import { ChatNav } from '../chat-nav';
import { ChatLayout } from '../layout';
import { ChatRoom } from '../chat-room';
import { ChatMessageList } from '../chat-message-list';
import { ChatMessageInput } from '../chat-message-input';
import { ChatHeaderDetail } from '../chat-header-detail';
import { useCollapseNav } from '../hooks/use-collapse-nav';
import HeaderSection from 'src/components/header-section/HeaderSection';
import { getStudyGroupById, getStudyGroups } from 'src/api/group';
import { UserItem } from 'src/types/user';
import useSWR from 'swr';
import { endpoints } from 'src/lib/axios';
import { IChatMessage } from 'src/types/chat';


export function ChatGroupView() {
    const { user } = useAuthContext();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedConversationId, setSelectedConversationId] = useState('');

    const { conversations, conversationsLoading } = useGetConversations();
    const { conversation, conversationError, conversationLoading } = useGetConversation(selectedConversationId);
    const [messages, setMessages] = useState<IChatMessage[]>(conversation?.messages ?? []);

    const roomNav = useCollapseNav();

    const conversationsNav = useCollapseNav();

    useEffect(() => {
        if (conversation?.messages) {
            setMessages(conversation.messages);
        }
    }, [conversation?.id]);

    const handleSocketMessage = useCallback((msg: IChatMessage) => {
        setMessages((prev) => {
            const exists = prev.some((m) => m.id === msg.id);
            if (exists) return prev;
            return [...prev, msg];
        });
    }, []);

    useSocketConversation(handleSocketMessage);

    const [recipients, setRecipients] = useState<UserItem[]>([]);

    const selectedGroupId = useMemo(() => {
        return searchParams.get('id') || '';
    }, [searchParams]);

    // fetch group detail
    const { data: groupData } = useSWR(
        selectedGroupId ? endpoints.studyGroup(`/${selectedGroupId}`) : null,
        () => getStudyGroupById(selectedGroupId)
    );

    useEffect(() => {
        if (
            groupData?.conversation?.id &&
            groupData.conversation.id !== selectedConversationId
        ) {
            setSelectedConversationId(groupData.conversation.id);
        }
    }, [groupData?.conversation?.id, selectedConversationId]);

    useEffect(() => {
        if (!selectedGroupId || groupData?.status === 'INACTIVE') {
            startTransition(() => {
                router.push(paths.dashboard.channel.root);
            });
        }
    }, [selectedGroupId, groupData]);

    // fetch list of groups
    const { data: listGroupData } = useSWR(
        groupData ? endpoints.studyGroup(`?channelId=${groupData.channel.id}`) : null,
        () => getStudyGroups(`?channelId=${groupData?.channel.id}`)
    );
    const handleAddRecipients = useCallback((selected: UserItem[]) => {
        setRecipients(selected);
    }, []);

    const filteredParticipants: { user: UserItem }[] =
        conversation?.participants?.filter(
            (participant) => participant.user.id !== `${user?.id}`
        ) ?? [];

    return (
        <DashboardContent
            maxWidth={false}
            sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}
        >
            <HeaderSection
                heading="Nhóm học tập"
                links={[
                    { name: 'Tổng quan', href: paths.dashboard.root },
                    { name: `${groupData?.channel.name}`, href: paths.dashboard.channel.root },
                    { name: `${groupData?.name}` },
                ]}
            />

            <ChatLayout
                slots={{
                    header: (
                        <ChatHeaderDetail
                            collapseNav={roomNav}
                            participants={conversation?.participants || []}
                            loading={conversationLoading}
                            groupData={groupData ?? undefined}
                            userInfo={user}
                            selectedGroupId={selectedGroupId}
                            selectedConversationId={selectedConversationId}
                        />
                    ),
                    nav: (
                        <ChatNav
                            conversations={conversations}
                            selectedConversationId={selectedConversationId}
                            collapseNav={conversationsNav}
                            loading={conversationsLoading}
                            groupConversations={listGroupData?.results}
                        />
                    ),
                    main: (
                        <>
                            {selectedConversationId ? (
                                conversationError ? (
                                    <EmptyContent
                                        title={conversationError.message}
                                        imgUrl={`${CONFIG.assetsDir}/assets/icons/empty/ic-chat-empty.svg`}
                                    />
                                ) : (
                                    <>
                                        {conversation?.messages.length === 0
                                            ?
                                            <EmptyContent
                                                title="Chưa có gì trong tin nhắn!"
                                                description="Hãy bắt đầu tạo cuộc trò chuyện..."
                                                imgUrl={`${CONFIG.assetsDir}/assets/icons/empty/ic-chat-empty.svg`}
                                            />
                                            :
                                            <ChatMessageList
                                                messages={messages}
                                                participants={filteredParticipants}
                                                loading={conversationLoading}
                                            />
                                        }
                                        <ChatMessageInput
                                            selectedConversationId={selectedConversationId}
                                            disabled={!recipients.length && !selectedConversationId}
                                        />
                                    </>
                                )
                            ) : (
                                <EmptyContent
                                    title="Chưa có gì trong tin nhắn!"
                                    description="Hãy bắt đầu tạo cuộc trò chuyện..."
                                    imgUrl={`${CONFIG.assetsDir}/assets/icons/empty/ic-chat-active.svg`}
                                />
                            )}
                        </>
                    ),
                    details: conversation && selectedConversationId && (
                        <ChatRoom
                            collapseNav={roomNav}
                            participants={conversation?.participants || []}
                            loading={conversationLoading}
                            messages={conversation?.messages ?? []}
                            type={conversation.type}
                            idOwner={groupData?.owner.id}
                        />
                    )
                }}
            />
        </DashboardContent>
    );
}