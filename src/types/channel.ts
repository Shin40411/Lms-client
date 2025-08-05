import { ClassItem } from "./classes";
import { StudyGroupItem } from "./studyGroup";
import { UserItem } from "./user";

export interface ChannelResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: ChannelItem[];
}

export interface ChannelItem {
    id: string;
    name: string;
    owner: UserItem;
    classroom: ClassItem;
    studyGroups: StudyGroupItem[];
    members: UserItem[];
    status: 'ACTIVE' | 'INACTIVE';
    description?: string;
}

export interface ChannelDTO {
    classroomId?: string;
    name: string;
    description?: string;
    type: string;
    members?: UserItem[];
}