import { createSlice } from "@reduxjs/toolkit";
import { initiateSignup, verifyOtp, saveUser, logIn, logout, getCurrentUser } from "./UserAction";

const userSlice = createSlice({
    name: "User",
    initialState: {
        loading: false,
        error: false,
        success: false,
        message: "",
        verifyOtpLoading: false,
        verifyOtpError: false,
        verifyOtpSuccess: false,
        verifyOtpMessage: "",
        saveUserLoading: false,
        saveUserError: false,
        saveUserSuccess: false,
        saveUserMessage: "",
        loginLoading: false,
        loginError: false,
        loginSuccess: false,
        loginMessage: "",
        user: {},
        token: null,
        isAuthenticated: false,
        authChecked: false,
        signupLoading: false,
        signupError: false,
        signupSuccess: false,
        signupMessage: "",
    },
    reducers: {
        clearError: (state) => {
            state.error = false;
            state.message = "";
        },
        clearSuccess: (state) => {
            state.success = false;
        },
        clearSignupError: (state) => {
            state.signupError = false;
            state.signupMessage = "";
        },
        clearSignupSuccess: (state) => {
            state.signupSuccess = false;
        },
        clearVerifyOtpError: (state) => {
            state.verifyOtpError = false;
            state.verifyOtpMessage = "";
        },
        clearVerifyOtpSuccess: (state) => {
            state.verifyOtpSuccess = false;
        },
        clearSaveUserError: (state) => {
            state.saveUserError = false;
            state.saveUserMessage = "";
        },
        clearSaveUserSuccess: (state) => {
            state.saveUserSuccess = false;
        },
        clearVerifyOtpLoading: (state) => {
            state.verifyOtpLoading = false;
        },
        clearSaveUserLoading: (state) => {
            state.saveUserLoading = false;
        },
        clearloginError: (state) => {
            state.loginError = false;
            state.loginMessage = "";
        },
        clearloginLoading: (state) => {
            state.loginLoading = false;
        },
        clearloginSuccess: (state) => {
            state.loginSuccess = false;
        },
        clearAuthState: (state) => {
            state.user = {};
            state.token = null;
            state.isAuthenticated = false;
            state.loginSuccess = false;
            state.loginError = false;
            state.loginMessage = "";
        },
        setAuthFromStorage: (state, action) => {
            state.token = action.payload;
            state.isAuthenticated = !!action.payload;
        },
        authChecked: (state) => {
            state.authChecked = true;
        }
    },
    extraReducers: (builder) => {
        builder
            // Initiate Signup
            .addCase(initiateSignup.pending, (state) => {
                state.signupLoading = true;
                state.signupError = false;
                state.signupSuccess = false;
                state.signupMessage = "";
            })
            .addCase(initiateSignup.fulfilled, (state, action) => {
                state.signupLoading = false;
                state.signupError = false;
                state.signupSuccess = true;
                state.signupMessage = action.payload.message;
            })
            .addCase(initiateSignup.rejected, (state, action) => {
                state.signupLoading = false;
                state.signupError = true;
                state.signupSuccess = false;
                state.signupMessage = action.payload;
            })
            // Verify OTP
            .addCase(verifyOtp.pending, (state) => {
                state.verifyOtpLoading = true;
                state.verifyOtpError = false;
                state.verifyOtpSuccess = false;
                state.verifyOtpMessage = "";
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.verifyOtpLoading = false;
                state.verifyOtpError = false;
                state.verifyOtpSuccess = true;
                state.verifyOtpMessage = action.payload.message;
                state.token = action?.payload?.token;
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.verifyOtpLoading = false;
                state.verifyOtpError = true;
                state.verifyOtpSuccess = false;
                state.verifyOtpMessage = action.payload;
            })
            // Save User
            .addCase(saveUser.pending, (state) => {
                state.saveUserLoading = true;
                state.saveUserError = false;
                state.saveUserSuccess = false;
                state.saveUserMessage = "";
            })
            .addCase(saveUser.fulfilled, (state, action) => {
                state.saveUserLoading = false;
                state.saveUserError = false;
                state.saveUserSuccess = true;
                state.saveUserMessage = action.payload.message;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
            })
            .addCase(saveUser.rejected, (state, action) => {
                state.saveUserLoading = false;
                state.saveUserError = true;
                state.saveUserSuccess = false;
                state.saveUserMessage = action.payload;
            })
            // login
            .addCase(logIn.pending, (state) => {
                state.loginLoading = true;
                state.loginError = false;
                state.loginSuccess = false;
            })
            .addCase(logIn.fulfilled, (state, action) => {
                state.loginLoading = false;
                state.loginSuccess = true;
                state.loginError = false;
                state.loginMessage = action?.payload?.message;
                state.user = action?.payload?.user;
                state.token = action?.payload?.token;
                state.isAuthenticated = true;
            })
            .addCase(logIn.rejected, (state, action) => {
                state.loginLoading = false;
                state.loginSuccess = false;
                state.loginError = true;
                state.loginMessage = action?.payload;
            })
            // logout
            .addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = false;
                state.message = action.payload.message;
                state.user = {};
                state.token = null;
                state.isAuthenticated = false;
                state.loginSuccess = false;
                state.loginError = false;
                state.loginMessage = "";
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = true;
                state.message = action.payload;
             
                state.user = {};
                state.token = null;
                state.isAuthenticated = false;
                state.loginSuccess = false;
                state.loginError = false;
                state.loginMessage = "";
            })
            // getCurrentUser
            .addCase(getCurrentUser.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
                state.authChecked = false;
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.authChecked = true;
            })
            .addCase(getCurrentUser.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = true;
                state.user = {};
                state.token = null;
                state.isAuthenticated = false;
                state.message = action.payload;
                state.authChecked = true;
            });
    },
});

export const {
    clearError,
    clearSuccess,
    clearSignupError,
    clearSignupSuccess,
    clearVerifyOtpError,
    clearVerifyOtpSuccess,
    clearSaveUserError,
    clearSaveUserSuccess,
    clearVerifyOtpLoading,
    clearSaveUserLoading,
    clearloginError,
    clearloginSuccess,
    clearloginLoading,
    clearAuthState,
    setAuthFromStorage,
    authChecked
} = userSlice.actions;

export default userSlice.reducer;
