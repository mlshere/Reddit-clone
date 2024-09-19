import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  Community,
  CommunitySnippet,
  communityState,
} from "../app/atoms/communitiesAtom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase/clientApp";
import {
  getDocs,
  collection,
  writeBatch,
  doc,
  increment,
} from "firebase/firestore";

const useCommunityData = () => {
  const [user] = useAuthState(auth);
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(" ");

  const onJoinOrLeaveCommunity = (
    communityData: Community,
    isJoined: boolean
  ) => {
    // check if user is joined
    // if not open auth modal
    if (isJoined) {
      leaveCommunity(communityData.id);
      return;
    }
    joinCommunity(communityData);
  };
  const getMySnippets = async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      // get user snippets
      const snippetDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/communitySnippets`)
      );
      const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as CommunitySnippet[],
      }));
    } catch (error) {
      console.log("getMySnippets error: ", error);
      setError("error.message");
    }
    setLoading(false);
  };

  const joinCommunity = async (communityData: Community) => {
    //batch write
    // add community to user snippets
    try {
      const batch = writeBatch(firestore);

      const newSnippet: CommunitySnippet = {
        communityId: communityData.id,
        imageUrl: communityData.imageURL || "",
        isModerator: false,
      };
      batch.set(
        doc(
          firestore,
          `users/${user?.uid}/communitySnippets`,
          communityData.id
        ),
        newSnippet
      );

      // add user to community members, update community members count (+1)

      batch.update(doc(firestore, "communities", communityData.id), {
        numberOfMembers: increment(1),
      });

      await batch.commit();

      //update recoil state - communityState.mySnippets

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [...prev.mySnippets, newSnippet],
      }));
    } catch (error) {
      console.log("joinCommunity error: ", error);
      setError("error.message");
    }
    setLoading(false);
  };

  const leaveCommunity = async (communityId: string) => {
    //batch write
    // remove community from user snippets

    try {
      const batch = writeBatch(firestore);

      batch.delete(
        doc(firestore, `users/${user?.uid}/communitySnippets`, communityId)
      );
      // remove user from community members, update community members count (-1)
      batch.update(doc(firestore, "communities", communityId), {
        numberOfMembers: increment(-1),

        
      });

      await batch.commit();
      // update recoil state - communityState.mySnippets
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: prev.mySnippets.filter(
          (item) => item.communityId !== communityId
        ),
      }));
    } catch (error) {
      console.log("leaveCommunity error: ", error);
      setError("error.message");
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log("User state:", user); // log user state
    if (!user) return;
    getMySnippets();
  }, [user]);

  return {
    //data and functions
    communityStateValue,
    onJoinOrLeaveCommunity,
    loading,
  };
};

export default useCommunityData;

function leaveCommunity(id: string) {
  throw new Error("Function not implemented.");
}
