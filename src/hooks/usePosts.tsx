import { useRecoilState } from "recoil";
import { Post, postState, PostVote } from "../app/atoms/postAtom";
import React from "react";
import { auth, firestore, storage } from "../firebase/clientApp";
import { ref, deleteObject } from "firebase/storage";
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  writeBatch,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const usePosts = () => {
  const [user] = useAuthState(auth);
  const [postStateValue, setPostStateValue] = useRecoilState(postState);

  const onVote = async (post: Post, vote: number, communityId: string) => {
    console.log("Post object:", post); // Log the post object

    // check for user
    if (!user) {
        console.error("User is not authenticated.");
        return;
      }
    
      // Ensure post.id exists
      if (!post.id) {
        console.error("Post ID is missing");
        return;
      }

    try {
      const { voteStatus } = post; 
      const existingVote = postStateValue.postVotes.find(
        (vote: { postId: string; }) => vote.postId === post.id
      );

      const batch = writeBatch(firestore);
      const updatedPost = { ...post };
      const updatedPosts = [...postStateValue.posts];
      let updatedPostVotes = [...postStateValue.postVotes];
      let voteChange = vote; // amount of vote change

      if (!existingVote) {
        // create new postVote doc
        const postVoteRef = doc(
          collection(firestore, "users", `${user?.uid}/postVotes`)
        );

        const newVote: PostVote = {
          id: postVoteRef.id,
          postId: post.id,
          communityId,
          voteValue: vote, // 1, -1
        };

        batch.set(postVoteRef, newVote);

        // await batch.commit()
        // add/subs 1 vote
        updatedPost.voteStatus = voteStatus + vote;
        updatedPostVotes = [...updatedPostVotes, newVote];
      }
      // Existing vote - user already voted
      else {
        const postVoteRef = doc(
          firestore,
          "users",
          `${user?.uid}/postVotes/${existingVote.id}`
        );

        // Removing vote ( up to neutral, neutral to up)
        if (existingVote.voteValue === vote) {
          // add/subs 1 vote from post.voteStatus
          updatedPost.voteStatus = voteStatus - vote;
          updatedPostVotes = updatedPostVotes.filter(
            (vote) => vote.id !== existingVote.id
          );
          // delete postVote doc
          batch.delete(postVoteRef);

          voteChange += -vote;
        }

        // Flipping vote (down to up, up to down)
        else {
          // add/subs 2 votes from post.voteStatus
          updatedPost.voteStatus = voteStatus + 2 * vote;

          const voteIdx = postStateValue.postVotes.findIndex(
            (vote: { id: string }) => vote.id === existingVote.id
          );

          updatedPostVotes[voteIdx] = {
            ...existingVote,
            voteValue: vote,
          };
          //updating existing postVote doc
          batch.update(postVoteRef, { voteValue: vote });
        }
      }
      voteChange += 2 * vote;

      // update postVote doc
      const postRef = doc(firestore, "posts", post.id);
      batch.update(postRef, { voteStatus: voteStatus + voteChange });

      await batch.commit();

      // update state
      const postIdx = postStateValue.posts.findIndex((item) => item.id === post.id);
      updatedPosts[postIdx] = updatedPost;

      setPostStateValue((prev) => ({
        ...prev,
        posts: updatedPosts,
        postVotes: updatedPostVotes,
      }));
    } catch (error: any) {
      console.log("onVote error", error);
    }
  };

  const onSelectPost = () => {};

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
      const postDocRef = doc(firestore, "posts", post.id);
      await deleteDoc(postDocRef);
      // update recoil state without post

      setPostStateValue((prev) => ({
        ...prev,
        posts: prev.posts.filter((p) => p.id !== post.id),
      }));

      return true;
    } catch (error: any) {
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
  };
};

export default usePosts;

