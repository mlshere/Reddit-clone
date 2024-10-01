import { firestore } from "../../../firebase/clientApp";
import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React, { use, useEffect } from "react";
import { Community, communityState } from "../../../app/atoms/communitiesAtom";
import safeJsonStringify from "safe-json-stringify";
import  NotFound  from '../../../component/Community/NotFound'
import Header from "@/component/Community/Header";
import PageContent from "@/component/Layout/PageContent";
import CreatePostLink from "../../../component/Community/CreatePostLink";
import Posts from "../../../component/Posts/Posts";
import { useSetRecoilState } from "recoil";
import About from "../../../component/Community/About";


type CommunityPageProps = {
  communityData: Community;
};

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
  console.log('here is communityData', communityData)

  const setCommunityStateValue = useSetRecoilState(communityState);

  if (!communityData) {
    return <NotFound />;
  }

  useEffect(() => {
    setCommunityStateValue((prev: any) => ({
      ...prev,
      currentCommunity: communityData,
    }));
  }, [communityData]);

  return (
    <>
      <Header communityData={communityData} />
      <PageContent>
        <>
        <CreatePostLink />
        <Posts communityData={communityData} user={{
            uid: ""
          }} />
       </>
        <>
          <About communityData={communityData} />
        </>
      </PageContent>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  console.log("GET SERVER SIDE PROPS RUNNING");
  
  try {
    const communityId = context.query.communityId; // Ensure this is 'communityId'
    console.log("Community ID:", communityId);

    if (typeof communityId !== 'string') {
      return { notFound: true }; // Return an object if communityId is invalid
    }

    const communityDocRef = doc(firestore, "communities", communityId);
    const communityDoc = await getDoc(communityDocRef);

    if (communityDoc.exists()) {
      console.log("Community found, returning data");

      return {
        props: {
          communityData: JSON.parse(
            safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() }) // Needed for dates
          ),
        },
      };
    } else {
      console.log("Community not found, returning notFound");

      return { notFound: true }; // Return 'notFound' for 404 page
    }
  } catch (error) {
    console.log(`getServerSideProps error: ${error}`);
    return {
      props: {}, // Return fallback props in case of an error
    };
  }
}


export default CommunityPage;
