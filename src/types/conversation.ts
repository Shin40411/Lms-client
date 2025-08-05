import { UniqueIdentifier } from "@dnd-kit/core";
import { IDateValue } from "./common";

export interface ConversationItem {
    id: UniqueIdentifier;
    name: string;
    lastMessageAt: IDateValue;
    isGroup: boolean;
}