import { Timestamp } from 'firebase-admin/firestore';
import { atom } from 'recoil';

export type Post = {
    id: string;
    communityIDe: string;
    creatorID: string;
    creatorDisplayName: string;
    title: string;
    body: string;
    numberOfComments: number;
    voteStatus: number;
    imageURL?: string;
    communityImageURL?: string;
    createdAt: Timestamp;
}

interface PostState {
    selectedPost: Post | null;
    post: Post[];
    //postVotes
}

const defaultPostState: PostState = {
    selectedPost: null,
    post: [],
    //postVotes
}

export const postState = atom<PostState>({
    key: 'postState',
    default: defaultPostState
});