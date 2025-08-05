import { Avatar, AvatarGroup, Badge, ListItemButton, ListItemText } from "@mui/material";
import { useGetConversation } from "src/actions/chat";

type Props = {
    conversationId: string;
    onClickResult: (id: string) => void;
};

export function ConversationItem({ conversationId, onClickResult }: Props) {
    const {
        conversation,
        conversationLoading,
        conversationError,
    } = useGetConversation(conversationId);

    if (conversationLoading) return <div>Đang tải...</div>;
    if (conversationError || !conversation) return <div>Lỗi hoặc không có dữ liệu</div>;

    return (
        <ListItemButton
            onClick={() => onClickResult(conversationId)}
            sx={{
                gap: 2,
                py: 1.5,
                px: 2.5,
                typography: 'subtitle2',
            }}
        >
            <Badge
                color="error"
                overlap="circular"
                badgeContent={conversation.unreadCount ?? 0}
            >
                {Array.isArray(conversation.participants) ? (
                    (conversation.participants.length > 1) ? (
                        <AvatarGroup variant="compact" sx={{ width: 48, height: 48 }}>
                            {conversation.participants.slice(0, 2).map((participant) => (
                                <Avatar
                                    key={participant.user?.id}
                                    alt={participant.user?.username}
                                    src={participant.user?.avatar}
                                />
                            ))}
                        </AvatarGroup>
                    ) : (
                        <Avatar
                            alt={conversation.participants[0].user?.username}
                            src={conversation.participants[0].user?.avatar}
                            sx={{ width: 48, height: 48 }}
                        />
                    )
                ) : (
                    <Avatar sx={{ width: 48, height: 48 }} />
                )}
            </Badge>

            <ListItemText
                primary={conversation.name}
                slotProps={{
                    primary: { noWrap: true },
                    secondary: {
                        noWrap: true,
                        sx: conversation.unreadCount
                            ? {
                                color: 'text.primary',
                                fontWeight: 'fontWeightSemiBold',
                            }
                            : {},
                    },
                }}
            />
        </ListItemButton>
    );
}