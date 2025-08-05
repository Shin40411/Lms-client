import { UniqueIdentifier } from "@dnd-kit/core";
import { UserItem } from "./user";
import { ConversationItem } from "./conversation";
import { IChatConversation } from "./chat";

export interface StudyGroupResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: StudyGroupItem[];
}

export interface StudyGroupItem {
    id: UniqueIdentifier;
    name: string;
    status: 'ACTIVE' | 'INACTIVE';
    channel: {
        id: string;
        name: string;
    };
    owner: UserItem;
    members: UserItem[];
    conversation: IChatConversation;
}

export interface StudyGroupDTO {
    channelId: UniqueIdentifier;
    name: string;
    members: UserItem[];
}

export interface studyGroupUpdateDTO {
    channelId: UniqueIdentifier;
    name?: string;
    members?: string[];
    status?: string;
}