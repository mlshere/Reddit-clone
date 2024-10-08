import { authModalState, ModalView } from '../../../app/atoms/authModalAtom';
import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Text } from '@chakra-ui/react';
import React, { useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import AuthInputs from './AuthInputs';
import OAuthButtons from './OAuthButtons';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';
import ResetPassword from '../ResetPassword';

const AuthModal: React.FC = () => {
    const [modalState, setModalState] = useRecoilState(authModalState);
    const [user, loading, error] = useAuthState(auth);
    
    const handleClose = useCallback(() => {
      setModalState((prev) => ({
        ...prev,
        open: false,
      }));
    }, [setModalState]);
    
    const toggleView = (view: string) => {
      setModalState({
        ...modalState,
        view: view as typeof modalState.view,
      });
    };

    useEffect(() => {
      if (user) {
        handleClose();
        console.log('user', user);
      }
    }, [user, handleClose]);
    return (
      <>
        <Modal isOpen={modalState.open} onClose={handleClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader textAlign="center">
              {modalState.view === 'login' && 'Log In'}
              {modalState.view === 'signup' && 'Sign Up'}
              {modalState.view === 'resetPassword' && 'Reset Password'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody 
              display='flex' 
              flexDirection='column' 
              alignItems='center' 
              justifyContent='center'
              pb={6}
            >
                <Flex 
                  direction='column' 
                  align='center' 
                  justify='center' 
                  width='70%' 
                  
                  >
                    {modalState.view === 'login' || modalState.view === 'signup' ? (
                    <>
                    
                    <OAuthButtons />
                    <Text color="gray.500" fontWeight={700}>OR</Text>
                    <AuthInputs/> 
                    </>
                    ) : (
                    <ResetPassword toggleView={toggleView} />
                    )}
                </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
};

export default AuthModal;