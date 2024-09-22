import PageContent from "@/component/Layout/PageContent";
import NewPostForm from "@/component/Posts/NewPostForm";
import { Box, Text } from "@chakra-ui/react";
import React from "react";

const SubmitPostPage: React.FC = () => {
  return (
    <PageContent >
      <>
        <Box>
          <Text p="14px 0px" borderBottom="1px solid" borderColor="white">
            Create a post
          </Text>
        </Box>
        <NewPostForm />
      </>
      <>
      {/* About */}
      </>
    </PageContent>
  );
};

export default SubmitPostPage;
