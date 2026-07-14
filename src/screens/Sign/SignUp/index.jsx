import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {toast} from "react-toastify";
import Loading from '../../../components/Loading'
import { initiateSignup, verifyOtp, saveUser } from '../../../../store/User/UserAction'
import { clearSignupError, clearSignupSuccess, clearVerifyOtpError, clearVerifyOtpSuccess, clearSaveUserError, clearSaveUserSuccess } from '../../../../store/User/UserReducer'
import './Signup.css'
import './OTP.css'

const SignUp = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { 
        signupLoading, 
        signupError, 
        signupSuccess, 
        signupMessage, 
        verifyOtpLoading, 
        verifyOtpError, 
        verifyOtpSuccess, 
        verifyOtpMessage,
        token,
        saveUserLoading, 
        saveUserError, 
        saveUserSuccess,
        saveUserMessage
    } = useSelector(state => state.user)

    const [formData, setformData] = useState({
        name: '',
        email: '',
        otp: '',
        password: '',
        confirmPassword: ''
    })

    const [verificationToken, setVerificationToken] = useState('')
    const [currentStep, setCurrentStep] = useState(1)
    const [otpValues, setOtpValues] = useState(['', '', '', '', '', ''])
    const [timer, setTimer] = useState(120)
    const [isActive, setIsActive] = useState(false)
    const [otpSent, setOtpSent] = useState(false)
    const [otpVerified, setOtpVerified] = useState(false)
    const [submittingUser, setSubmittingUser] = useState(false)

    useEffect(() => {
        dispatch(clearSignupSuccess())
        dispatch(clearSignupError())
        dispatch(clearVerifyOtpSuccess())
        dispatch(clearVerifyOtpError())
        dispatch(clearSaveUserSuccess())
        dispatch(clearSaveUserError())
    }, [dispatch])

    useEffect(() => {
        if (currentStep === 2) {
            setTimer(120);
            setIsActive(false);
        }
    }, [currentStep]);

    useEffect(() => {
        if (currentStep !== 2) return; 
        if (timer === 0) {
            setIsActive(true)
            return;
        }
        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [currentStep, timer]);

    useEffect(() => {
        if (signupSuccess && currentStep === 1 && otpSent) {
            setCurrentStep(2)
            dispatch(clearSignupSuccess())
        }
        if (verifyOtpSuccess && currentStep === 2 && otpVerified) {
            console.log('OTP verification response:', { token, verifyOtpMessage });
            if (token) {
                console.log('Setting verification token:', token);
                setVerificationToken(token);
                setCurrentStep(3);
                dispatch(clearVerifyOtpSuccess());
            } else {
                console.error('No token found in state:', { token, verifyOtpMessage });
                toast.error("No verifcation token received!", {
                    position: "top-right",
                    bodyStyle: {fontSize: "16px"}
                })
            }
        }
        if (saveUserSuccess && submittingUser) {
            navigate('/')
            dispatch(clearSaveUserSuccess())
        }
    }, [signupSuccess, verifyOtpSuccess, saveUserSuccess, currentStep, dispatch, navigate, token, verifyOtpMessage, otpSent, otpVerified, submittingUser])

    const handleResend = () => {
        setIsActive(false)
        setTimer(120)
        setOtpSent(true)
        dispatch(initiateSignup({ 
            name: formData.name,
            email: formData.email 
        }))
    }

    const formatTime = (seconds) => {
        const mins = String(Math.floor(seconds / 60)).padStart(2, '0')
        const secs = String(seconds % 60).padStart(2, '0')
        return `${mins}:${secs}`
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setformData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleOtpChange = (index, value) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newOtpValues = [...otpValues]
            newOtpValues[index] = value
            setOtpValues(newOtpValues)
            
            // Auto-focus next input
            if (value && index < 5) {
                const nextInput = document.querySelector(`input[name=otp-${index + 1}]`)
                if (nextInput) nextInput.focus()
            }
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
            const prevInput = document.querySelector(`input[name=otp-${index - 1}]`)
            if (prevInput) prevInput.focus()
        }
        else if (e.key === 'ArrowLeft' && index > 0) {
            const prevInput = document.querySelector(`input[name=otp-${index - 1}]`)
            if (prevInput) prevInput.focus()
        }
        else if (e.key === 'ArrowRight' && index < 5) {
            const nextInput = document.querySelector(`input[name=otp-${index + 1}]`)
            if (nextInput) nextInput.focus()
        }
    }

    const handleNextStep = (e) => {
        e.preventDefault()
        const form = e.target.closest('form')
        if (form.checkValidity()) {
            if (currentStep === 1) {
                // Validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                if (!emailRegex.test(formData.email)) {
                    alert('Please enter a valid email address')
                    return
                }
          
                setOtpSent(true)
                dispatch(initiateSignup({ 
                    name: formData.name,
                    email: formData.email 
                }))
            } else if (currentStep === 2) {
   
                if (otpValues.some(value => !value)) {
                    toast.error('Please enter the complete verification code', {
                        position: "top-right",
                        bodyStyle: {fontSize: "16px"},
                    })
                    return
                }
                const otp = otpValues.join('')
                setOtpVerified(true)
                dispatch(verifyOtp({ 
                    email: formData.email, 
                    otp 
                }))
            }
        } else {
            form.reportValidity()
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const form = e.target
        if (form.checkValidity()) {
            if (!verificationToken) {
                alert('Verification token is missing. Please try the OTP verification again.');
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                alert('Passwords do not match')
                return
            }
            if (formData.password.length < 6) {
                alert('Password must be at least 6 characters long')
                return
            }
            console.log('Submitting with token:', verificationToken);
            setSubmittingUser(true)
            dispatch(saveUser({
                token: verificationToken,
                password: formData.password,
                confirmPassword: formData.confirmPassword
            }))
        } else {
            form.reportValidity()
        }
    }

    return (
        <div className="signup-container">
            {signupLoading ? (
                <Loading/>
            ) : 
            <div className="signup-form-container">
                <h2>Create Account</h2>
                
                <div className="step-indicator">
                    <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1</div>
                    <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2</div>
                    <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>3</div>
                </div>

                <form className="signup-form" onSubmit={handleSubmit}>
                    {/* Step 1: Name and Email */}
                    {currentStep === 1 && (
                        <div className="form-step">
                            <h3>Enter Your Details</h3>
                            {signupError && <div className="error-message">{signupMessage}</div>}
                  
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            <button 
                                type="button" 
                                className="next-button"
                                onClick={handleNextStep}
                                disabled={signupLoading}
                            >
                                {signupLoading ? 'Sending...' : 'Continue'}
                            </button>
                        </div>
                    )}

                    {/* Step 2: OTP Verification */}
                    {currentStep === 2 && (
                        <div className="form-step">
                            <h3>Enter Verification Code</h3>
                            <p className="otp-info">We've sent a verification code to your email</p>
                            {verifyOtpError && <div className="error-message">{verifyOtpMessage}</div>}
                            
                            <div className="otp-container">
                                <div className="otp-input-group">
                                    {otpValues.map((value, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            name={`otp-${index}`}
                                            className={`otp-input ${value ? 'filled' : ''}`}
                                            value={value}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            maxLength={1}
                                            required
                                        />
                                    ))}
                                </div>
                                
                                <div className="otp-timer">
                                    Code expires in <span>{formatTime(timer)}</span>
                                </div>
                                
                                <div className="resend-otp">
                                    <button type="button" disabled={!isActive} onClick={handleResend}>Resend Code</button>
                                </div>
                            </div>

                            <button 
                                type="button" 
                                className="verify-button"
                                onClick={handleNextStep}
                                disabled={verifyOtpLoading}
                            >
                                {verifyOtpLoading ? 'Verifying...' : 'Continue'}
                            </button>
                        </div>
                    )}

                    {/* Step 3: Password Setup */}
                    {currentStep === 3 && (
                        <div className="form-step">
                            <h3>Set Your Password</h3>
                            {saveUserError && <div className="error-message">{saveUserMessage}</div>}
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter your password"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Confirm your password"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <button type="submit" className="signup-button" disabled={saveUserLoading}>
                                {saveUserLoading ? 'Creating Account...' : 'Complete Sign Up'}
                            </button>
                        </div>
                    )}

                    <div className="signup-footer">
                        <p>Already have an account? <a href="/login">Login</a></p>
                    </div>
                </form>
            </div>
            }
        </div>
    )
}

export default SignUp