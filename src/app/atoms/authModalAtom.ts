import { atom } from 'recoil';

export interface AuthModalState {
    open: boolean;
    view: "login" | 'signup' | 'resetPassword';
};

const defaultModalState: AuthModalState = {
    open: false,
    view: 'login',
};

export const authModalState = atom<AuthModalState>({
    key: 'authModalStateAtom',
    default: defaultModalState,
});


export type ModalView = "login" | "signup" | "resetPassword";