import { useRecoilState } from "recoil";
import { Post, postState } from "../app/atoms/postAtom";
import React from "react";
import { firestore, storage } from "../firebase/clientApp";
import { ref, deleteObject } from "firebase/storage";
import { deleteDoc, doc, DocumentData, DocumentReference } from "firebase/firestore";

const usePosts = () => {
    const [postStateValue, setPostStateValue] = useRecoilState(postState);

    const onVote = async () => {};

    const onSelectPost = () => {

    };

    const onDeletePost = async (post: Post): Promise<boolean> => {
       try {
        // check if post has image
        if (post.imageURL) {
            // delete image from storage
            const imageRef = ref(storage, `posts/${post.id}/image`);
            await deleteObject(imageRef);
        }

        // delete post in firestore
        
        if (!post.id) {
            throw new Error("Post ID is missing");
        }
        const postDocRef = doc(firestore, 'posts', post.id);
        await deleteDoc(postDocRef);
        // update recoil state without post

        setPostStateValue((prev) => ({
            ...prev,
            posts: prev.posts.filter((p) => p.id !== post.id),
        }));    

        return true;
       }  catch (error: any) {
           console.log("Delete post error", error.message);
           return false;
       }
    };

    return {
        postStateValue,
        setPostStateValue,
        onVote,
        onSelectPost,
        onDeletePost,
    }
} 

export default usePosts;


function delectDoc(postDocRef: DocumentReference<DocumentData, DocumentData>) {
    throw new Error("Function not implemented.");
}

