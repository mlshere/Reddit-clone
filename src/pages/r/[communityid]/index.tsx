import { firestore } from "../../../firebase/clientApp";
import { doc, getDoc } from "firebase/firestore";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React from "react";
import { Community } from "../../../app/atoms/communitiesAtom";
import safeJsonStringify from "safe-json-stringify";
import { NOTFOUND } from "dns";
import NotFound from "@/component/Community/NotFound";
import { error } from "console";
import Header from "@/component/Community/Header";
import PageContent from "@/component/Layout/PageContent";
import CreatePostLink from "../../../component/Community/CreatePostLink";

type CommunityPageProps = {
  communityData: Community;
};

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
  if (!communityData) {
    return <NotFound />;
  }

  return (
    <>
      <Header communityData={communityData} />
      <PageContent>
        <>
        <CreatePostLink />
       </>
        <>
          <div> RHS</div>
        </>
      </PageContent>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // get community data and pass it to the component

  try {
    const communityDocRef = doc(
      firestore,
      "communities",
      context.query.communityid as string
    );
    const communityDoc = await getDoc(communityDocRef);

    return {
      props: {
        communityData: communityDoc.exists()
          ? JSON.parse(
              safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() })
            )
          : "",
      },
    };
  } catch (error) {
    // add error handling
    console.log(`getServerSideProps error: ${error}`);
  }
}

export default CommunityPage;
