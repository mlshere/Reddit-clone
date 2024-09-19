import { Timestamp } from 'firebase-admin/firestore';
import { atom } from 'recoil';

export interface Community {
    imageURL: any;
    id: string;
    cratorId: string;
    numberOfMembers: number;
    privacyType: "public" | "restricted" | "private";  
    // optional + ?
    createdAt?: Timestamp
    imageURI?: string;
}

export interface CommunitySnippet {
    communityId: string;
    isModerator: boolean;
    imageUrl?: string;
}

interface CommunityState {
    mySnippets: CommunitySnippet[];
    //visitedCommunities:
}

const defaultCommunityState: CommunityState = {
    mySnippets: []
}

export const communityState = atom<CommunityState>({
    key: 'communityState',
    default: defaultCommunityState,
})