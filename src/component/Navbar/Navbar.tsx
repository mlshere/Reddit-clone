import { Flex, Image } from "@chakra-ui/react";
import React, { useEffect } from "react";
import SearchInput from "./SearchInput";
import RightContent from "./RightContent/RightContent";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import Directory from "./Directory/Directory";
import useDirectory from "@/hooks/useDirectory";
import { defaultMenuItem } from "@/app/atoms/directoryMenuAtom";

const Navbar: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  const { menuState, onSelectMenuItem } = useDirectory();

  useEffect(() => {
    // Force re-render when menuState changes
  }, [menuState]);
  
  return (
    <>
      <Flex 
        bg="white" 
        height="44px" 
        padding="6px 12px"
        justify={{ md: "space-between" }}
        >
        <Flex 
            align="center"
            width={{ base: "40px", md: "auto"}}
            mr={{ base: 0, md: 2}}
            cursor="pointer"
            onClick={() => onSelectMenuItem(defaultMenuItem)}
        >
          <Image
            src="/images/redditFace.svg"
            height="30px"
            alt="reddit logo face"
          />
          <Image
            src="/images/redditText.svg"
            height="46px"
            alt="reddit text"
            display={{ base: "none", md: "unset" }}
          />
        </Flex>
        {user && <Directory />}
        <SearchInput user={user} />
        <RightContent user={user} />
      </Flex>
    </>
  );
};

export default Navbar;
