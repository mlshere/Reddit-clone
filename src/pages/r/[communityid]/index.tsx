import { firestore } from "../../../firebase/clientApp";
import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React from "react";
import { Community } from "../../../app/atoms/communitiesAtom";
import safeJsonStringify from "safe-json-stringify";
import  NotFound  from '../../../component/Community/NotFound'
import Header from "@/component/Community/Header";
import PageContent from "@/component/Layout/PageContent";
import CreatePostLink from "../../../component/Community/CreatePostLink";
import Posts from "../../../component/Posts/Posts";


type CommunityPageProps = {
  communityData: Community;
};

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
  console.log('here is communityData', communityData)
  if (!communityData) {
    return <NotFound />;
  }

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
          <div> RHS</div>
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
