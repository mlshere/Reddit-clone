import {
  query,
  collection,
  where,
  orderBy,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { Community } from "../../app/atoms/communitiesAtom";
import React, { useEffect, useState } from "react";
import { auth, firestore } from "../../firebase/clientApp";
import usePosts from "../../hooks/usePosts";
import { Post } from "../../app/atoms/postAtom";
import PostItem from "./PostItem";
import { useAuthState } from "react-firebase-hooks/auth";
import { Stack } from "@chakra-ui/react";
import { get } from "http";

type PostsProps = {
  communityData: Community;
  user: { uid: string };
};

const Posts: React.FC<PostsProps> = ({ communityData }) => {
  //useAuthState(auth);
  const [user, loadingUser, error] = useAuthState(auth);
  const [loading, setLoading] = useState(false);

  const {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  } = usePosts();

  const getPosts = async () => {
    try {
      // get posts for this community
      const postsQuery = query(
        collection(firestore, "posts"),
        where("communityId", "==", "communityData.id"),
        orderBy("createdAt", "desc")
      );
      const postDocs = await getDocs(postsQuery);

      //Store in post state
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));

      console.log("posts", posts);
    } catch (error: any) {
      console.log("getPosts error", error.message);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <Stack>
      {postStateValue.posts.map((item) => (
        <PostItem
        key={item.id}
        post={item}
        userIsCreator={user?.uid === item.creatorId}
        userVoteValue={0}
        onVote={onVote}
        onSelectPost={onSelectPost}
        onDeletePost={onDeletePost}
      />
      ))}
   </Stack>
  );
};

export default Posts;
