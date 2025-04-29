import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";


export interface Auth_User {
    _id: string;
    name: string;
    email: string;
    profilePicture: string;
    accessToken: string;
}

export interface Auth_State {
    currentUser: Auth_User | null;
    isLoggedIn: boolean;
    isSetOtpModelOpen: boolean
}


export interface AuthFormInputs {
    name: string
    email: string
    password: string
    confirmPassword: string
}

export interface AuthLoginData {
    email: string,
    password: string
}

export interface AuthForgotPasswordInputs {
    email: string
}

export interface AuthLayoutProps {
    title?: string
    subtitle?: string
    isSignUp?: boolean
    resetPassword?: boolean
    forgotPassword?: boolean
    onSubmit: () => void
    register: UseFormRegister<AuthFormInputs>
    errors: FieldErrors<AuthFormInputs>
    watch?: UseFormWatch<AuthFormInputs>
    isLoading: boolean
    footerQuestion?: string
    footerLinkText?: string
    footerLinkPath?: string
    submitButtonText?: string
    forgotPasswordURL?: string
    googleLoginOption?: boolean
    handleGoogleLogin?: () => void

}

export interface ErrorResponse {
    status: number;
    data: {
        status: "error" | "fail";
        message: string;
        timestamp: string;
    };
}
