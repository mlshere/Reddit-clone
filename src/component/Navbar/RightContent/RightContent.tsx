import { Button, Flex } from '@chakra-ui/react';
import React from 'react';
import AuthButtons from './AuthButtons';
import AuthModal from '../../Modal/Auth/AuthModal';
import { signOut, User } from 'firebase/auth';
import { auth } from '@/firebase/clientApp';
import Icons from './Icons';
import UserMenu from './UserMenu';

type RightContentProps = {
    user: User | null | undefined;
};

const RightContent: React.FC<RightContentProps> = ({ user }) => {
    return (
       <>
        <AuthModal />
        <Flex justify="center" align="center">
           {user ? <Icons  /> : <AuthButtons />}
            {<UserMenu />}
        </Flex>
        </>
    );
}
export default RightContent;