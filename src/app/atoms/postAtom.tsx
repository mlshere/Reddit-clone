import { Timestamp } from 'firebase-admin/firestore';
import { atom } from 'recoil';

export type Post = {
    id: string;
    communityId: string;
    creatorId: string;
    creatorDisplayName: string;
    title: string;
    body: string;
    numberOfComments: number;
    voteStatus: number;
    imageURL?: string;
    communityImageURL?: string;
    createdAt: Timestamp;
}

export type PostVote = {
    id: string;
    postId: string;
    communityId: string;
    // userId: string;
    voteValue: number;
}

interface PostState {
    [x: string]: any;
    selectedPost: Post | null;
    posts: Post[];
    postVotes: PostVote[]
}

const defaultPostState: PostState = {
    selectedPost: null,
    posts: [],
    postVotes: [],
}

export const postState = atom<PostState>({
    key: 'postState',
    default: defaultPostState
});