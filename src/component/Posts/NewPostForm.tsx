import { Alert,  AlertIcon, Text, Flex, Icon } from "@chakra-ui/react";
import React, { useState, useRef, useEffect } from "react";
import { BiPoll } from "react-icons/bi";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import TabItemComponent from "./TabItem";
import TextInputs from "../Posts/PostForm/TextInputs";
import ImageUpload from "./PostForm/ImageUpload";
import { Post } from "../../app/atoms/postAtom";
import { User } from 'firebase/auth';
import { useRouter } from "next/router";
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { firestore, storage } from "../../firebase/clientApp";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

type NewPostFormProps = {
  user: User;
  // communityId: string;
  // communityImageURL: string;
};

const formTabs: TabItem[] = [
  {
    title: "Post",
    icon: IoDocumentText,
  },
  {
    title: "Image & Video",
    icon: IoImageOutline,
  },
  {
    title: "Link",
    icon: BsLink45Deg,
  },
  {
    title: "Poll",
    icon: BiPoll,
  },
  {
    title: "Talk",
    icon: BsMic,
  },
];

export type TabItem = {
  title: string;
  icon: typeof Icon.arguments;
}; 

const NewPostForm: React.FC<NewPostFormProps> = ({
  user,
  // communityId,
  // communityImageURL,
}) => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInputs, setTextInputs] = useState({
    title: "",
    body: "",
  });
  const [selectedFile, setSelectedFile] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [communityId, setCommunityId] = useState<string | null>(null);

  // retrieve communityId from router
  useEffect(() => {
    if (router.isReady) {
      console.log("Router query:", router.query);
      const { communityId } = router.query;
      if (communityId) {
        setCommunityId(communityId as string);
      } else {
        console.error("Community ID is undefined or missing");
      }
    }
  }, [router.isReady, router.query]);

  const handleCreatePost = async () => {
    
    const { communityId } = router.query;
    console.log(router.query);
    if (!communityId) {
      console.log("Community ID is undefined");
      return;
    }
    const newPost: Post = {
      id: "",
      communityId: communityId as string,
      creatorId: user.uid,
      creatorDisplayName: user.email!.split("@")[0],
      title: textInputs.title,
      body: textInputs.body,
      numberOfComments: 0,
      voteStatus: 0,
      createdAt: serverTimestamp() as Timestamp,
    }

    setLoading(true);
   
    try {
      const postDocRef = await addDoc(collection(firestore, "posts"), newPost);
        // Get the generated ID from the document reference
        const postId = postDocRef.id;

        // Update the post with the generated ID
        await updateDoc(postDocRef, { id: postId });

      console.log("HERE IS NEW POST ID", postDocRef.id);
      // check if image is selected (selectedFile truthy)
      if (selectedFile) {
        // storage image in firebase storage => geDownloadURL (return imgurl)

        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        await uploadString(imageRef, selectedFile, "data_url");
        const downloadURL = await getDownloadURL(imageRef);

        // update post with imgurl
        await updateDoc(postDocRef, {
          imageURL: downloadURL,
        });
      }

    
    } catch (error: any) {
      console.log("handleCreatePost error", error.message);
      setError(true);
    }

    
    setLoading(false);

    // redirect to commuity page
    router.back();
  };

  const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();

    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target?.result as string);
      }
    };
  };

  const onTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { name, value },
    } = event;
    setTextInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Flex direction="column" bg="white" borderRadius={4} mt={2}>
      <Flex width="100%">
        {formTabs.map((item) => (
          <TabItemComponent
            key={item.title}
            item={item}
            selected={item.title === selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </Flex>
      <Flex p={4}>
        {selectedTab === "Post" && (
          <TextInputs
            textInputs={textInputs}
            handleCreatePost={handleCreatePost}
            onChange={onTextChange}
            loading={loading}
          />
        )}
        {selectedTab === "Image & Video" && (
          <ImageUpload
            selectedFile={selectedFile}
            onSelectImage={onSelectImage}
            setSelectedFile={setSelectedFile}
            setSelectedTab={setSelectedTab}
          />
        )}
      </Flex>
      {error && (
        <Alert status='error'>
        <AlertIcon />
       <Text mr={2}>Error creating post</Text>
      </Alert>
      )}
    </Flex>
  );
};

export default NewPostForm;
