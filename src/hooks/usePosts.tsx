import { useRecoilState } from "recoil";
import { postState } from "../app/atoms/postAtom";
import React from "react";

const usePosts = () => {
    const [postStateValue, setPostStateValue] = useRecoilState(postState);

    const onVote = async () => {};

    const onSelectPost = () => {

    };

    const onDeletePost = async () => {};

    return {
        postStateValue,
        setPostStateValue,
        onVote,
        onSelectPost,
        onDeletePost,
    }
} 

export default usePosts;


