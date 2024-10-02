import React, { useCallback, useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
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
  getDoc,
} from "firebase/firestore";
import { authModalState } from "@/app/atoms/authModalAtom";
import { useRouter } from "next/router";

const useCommunityData = () => {
  const [user] = useAuthState(auth);
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(" ");
  const router = useRouter();

  const onJoinOrLeaveCommunity = useCallback(
    (
      communityData: Community,
      isJoined: boolean
    ) => {
      // check if user is joined
      // if not open auth modal
      if (!user) {
        //open auth modal
        setAuthModalState({ open: true, view: "login" });
        return;
      }
  
      setLoading(true);
      if (isJoined) {
        leaveCommunity(communityData.id);
        return;
      }
      joinCommunity(communityData);
    },
    [user, setAuthModalState]
  );
  const getMySnippets = useCallback(async () => {
    if (!user?.uid) return;
    setLoading(true);

    try {
      const snippetDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/communitySnippets`)
      );
      const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));
      console.log("here are snippets", snippets);
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as CommunitySnippet[],
        snippetsFetched: true,
      }));
    } catch (error: any) {
      console.error("getMySnippets error: ", error.message);
      setError(error.message || "Failed to get community snippets.");
    }

    setLoading(false);
  }, [user, setCommunityStateValue]);

  const joinCommunity =  useCallback(
  async (communityData: Community) => {
    //batch write
    // add community to user snippets
    try {
      const batch = writeBatch(firestore);

      const newSnippet: CommunitySnippet = {
        communityId: communityData.id,
        imageURL: communityData.imageURL || "",// add imageURL fixed the error
        isModerator: user?.uid === communityData.creatorId,
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
  },  [user, setCommunityStateValue])

  const leaveCommunity = useCallback(
  async (communityId: string) => {
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
  },     [user, setCommunityStateValue]
)

  const getCommunityData = useCallback(
    async (communityId: string) => {
      try {
        const communityDocRef = doc(firestore, "communities", communityId);
        const communityDoc = await getDoc(communityDocRef);

        setCommunityStateValue((prev) => ({
          ...prev,
          currentCommunity: { id: communityDoc.id, ...communityDoc.data() } as Community,
        }));
      } catch (error) {
        console.log("getCommunityData error", error);
      }
    }, [setCommunityStateValue]
  )

  useEffect(() => {
    console.log("User state:", user); // log user state
    if (!user) {
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [],
        snippetsFetched: false,
      }));
      return;
    }
    getMySnippets();
  }, [user, getMySnippets]);

useEffect(() => {
  const { communityId } = router.query;

  if (communityId && !communityStateValue.currentCommunity) {
    getCommunityData(communityId as string);
  }
}, [router.query, communityStateValue.currentCommunity]);


  return {
    //data and functions
    communityStateValue,
    onJoinOrLeaveCommunity,
    loading,
    error,
  };
};

export default useCommunityData;


