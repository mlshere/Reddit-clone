import { Flex } from '@chakra-ui/react';
import React from 'react';
import Image from 'next/image';

const Navbar: React.FC = () => { 
    return (
        <>
            <Flex bg="white" height="44px" padding="6px 12px">
               <Flex>
                <Image src="/images/redditFace.svg" height={30} width={30} alt="reddit logo face" />
                <Image src="/images/redditText.svg" height={46} width={46} alt="reddit text" />
                </Flex> 
            </Flex>
        </>
    )
}

export default Navbar;