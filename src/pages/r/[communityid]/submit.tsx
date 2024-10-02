import PageContent from "@/component/Layout/PageContent";
import NewPostForm from "@/component/Posts/NewPostForm";
import { Box, Text } from "@chakra-ui/react";
import { auth } from "../../../firebase/clientApp";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { communityState } from "@/app/atoms/communitiesAtom";
import useCommunityData from "@/hooks/useCommunityData";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import About from "@/component/Community/About";

const SubmitPostPage: React.FC = () => {
  const [user, loadingUser] = useAuthState(auth);
  const router = useRouter();
  const { community } = router.query;
  const { communityStateValue } = useCommunityData();
  console.log("COMMUNITY", communityStateValue);
  const { loading } = useCommunityData();

  return (
    <PageContent>
      <>
        <Box>
          <Text p="14px 0px" borderBottom="1px solid" borderColor="white">
            Create a post
          </Text>
        </Box>
        {user && <NewPostForm user={user} communityImageURL={communityStateValue.currentCommunity?.imageURL}/>}
      </>
      <>
        {communityStateValue.currentCommunity && (
          <About communityData={communityStateValue.currentCommunity} />
        )}
      </>
    </PageContent>
  );
};

export default SubmitPostPage;
