import { authModalState, ModalView } from "../../app/atoms/authModalAtom";
import { Button, Flex, Input, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/clientApp'
import { FIREBASE_ERRORS } from '../../firebase/errors'

type LoginProps = {
    toggleView: (view: ModalView) => void;
};

const Login: React.FC<LoginProps> = ({ toggleView }) => {
    const setAuthModalState = useSetRecoilState(authModalState);    
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: ''
    });
    const [formError, setFormError] = useState("");
    const [
        signInWithEmailAndPassword,
        _,
        loading,
        error,
      ] = useSignInWithEmailAndPassword(auth)

    
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); 
        if (formError) setFormError("");
        if (!loginForm.email.includes("@")) {
          return setFormError("Please enter a valid email");
        }
        try {
            signInWithEmailAndPassword(loginForm.email, loginForm.password);
        } catch (error) {
            console.log(error);
        }
    }

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // update form state
        setLoginForm((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    }

    return (
        <form onSubmit={onSubmit}>
            <Input 
                required
                name="email"
                placeholder="Email"
                type="email"
                mb={2}
                onChange={onChange}
                fontSize="10pt"
                _placeholder={{ color: 'gray.500' }}
                _hover={{
                    bg: "white",
                    border: "1px solid",
                    borderColor: "gray.500",   
                }}
                _focus={{
                    outline: "none",
                    bg: "white",
                    border: "1px solid",
                    borderColor: "blue.500",
                }}
                bg="gray.50"

            />
            <Input 
                required
                name="password"
                placeholder="Password"
                type="password"
                mb={2}
                onChange={onChange}
                fontSize="10pt"
                _placeholder={{ color: 'gray.500' }}
                _hover={{
                    bg: "white",
                    border: "1px solid",
                    borderColor: "gray.500",   
                }}
                _focus={{
                    outline: "none",
                    bg: "white",
                    border: "1px solid",
                    borderColor: "blue.500",
                }}
                bg="gray.50"
            />
            {error && (
                <Text textAlign="center" color="red" fontSize="10pt">
                    {FIREBASE_ERRORS[error.message as keyof typeof FIREBASE_ERRORS] || error.message}
                </Text>
            )}
            <Button 
                type="submit"
                width="100%"
                height="36px"
                mt={2}
                mb={2}
                isLoading={loading} 
                >  
                Log In
            </Button>
            <Flex justifyContent="center" mb={2}>
        <Text fontSize="9pt" mr={1}>
          Forgot your password?
        </Text>
        <Text
          fontSize="9pt"
          color="blue.500"
          cursor="pointer"
          onClick={() => setAuthModalState((prev: any) => ({
            ...prev,
            view: 'resetPassword',
        }))
        }
        >
          Reset
        </Text>
      </Flex>
            <Flex fontSize="9pt" justifyContent="center">
                <Text mr={1}>New here?</Text>
                <Text
                    color="blue.500"
                    fontWeight={700}
                    cursor="pointer"
                    onClick={() => setAuthModalState((prev: any) => ({
                        ...prev,
                        view: 'signup',
                    }))
                }
                >SIGN UP</Text>
            </Flex>
        </form>
    );
};

export default Login;