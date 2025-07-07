import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MailCheck, RefreshCw, Home, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '../services/api'

const OTPVerification = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [email, setEmail] = useState("")
    const { signup } = useAuth()

    useEffect(() => {
        const userDetailsString = localStorage.getItem('userdetails');
        if (userDetailsString) {
            try {
                const userDetails = JSON.parse(userDetailsString);
                setEmail(userDetails.email || "");
            } catch (e) {
                setEmail("");
            }
        } else {
            toast({
                title: "User details are not available",
                description: "Please fill signup form before entering otp",
                variant: "destructive"
            })
        }
    }, []);

    const handleVerify = async () => {
        try {

            const userDetailsString = localStorage.getItem('userdetails');
            if (userDetailsString == undefined || userDetailsString == null) {
                toast({
                    title: "User details are not available",
                    description: "Please fill signup form before entering otp",
                    variant: "destructive"
                })
                return;
            } else if (userDetailsString.length == 0) {
                toast({
                    title: "User details are not available",
                    description: "Please fill signup form before entering otp",
                    variant: "destructive"
                })
                return;
            }

            if (otp.length !== 6) {
                toast({
                    title: "Invalid OTP",
                    description: "Please enter a valid 6-digit OTP code.",
                    variant: "destructive",
                });
                return;
            }

            setIsLoading(true);
            const sentOtp = document.cookie.split('; ').find(row => row.startsWith('otp' + '='))?.split('=')[1]

            if (sentOtp == undefined || sentOtp == null) {
                toast({
                    title: "OTP Error",
                    description: "Time expired to verify otp. click on resend otp to get otp",
                    variant: "destructive",
                })
            } else if (otp === sentOtp) {
                toast({
                    title: "OTP Verified",
                    description: "Your OTP has been verified successfully.",
                    variant: "default",
                })
                const userDetails = JSON.parse(localStorage.getItem("userdetails"))
                await signup(userDetails.name, userDetails.email, userDetails.password)
                toast({
                    title: "Account created successfully! Please complete your profile.",
                    variant: "default",
                });
                localStorage.removeItem('userdetails')
                document.cookie = `otp =  ; expires = ; path= `;
                navigate('/profile');
            } else {
                toast({
                    title: "Incorrect OTP",
                    description: "The OTP you entered is incorrect.",
                    variant: "destructive",
                })
            }

        } catch (error) {
            toast({
                title: "Error in verifying otp",
                description: error.message,
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    };

    const handleResendOTP = async () => {
        try {
            setIsResending(true);
            document.cookie = `otp =  ; expires = ; path= `;
            const userdetails = JSON.parse(localStorage.getItem('userdetails'))
            const otpResponse = await authApi.otp({ email: userdetails.email });
            const otp = otpResponse?.data?.otp || '';
            document.cookie = `otp = ${otp} ; expires = ${new Date(Date.now() + 2 * 60 * 1000).toUTCString()}; path=/`;
            toast({
                title: "OTP Resent",
                description: `A new verification code has been sent to ${email}`,
                variant: "default",
            });
        } catch (error) {
            toast({
                title: "Error in sending otp",
                description: error?.message,
                variant: "destructive"
            })
        } finally {
            setIsResending(false)
        }
    };

    const backToSignup = () => {
        localStorage.removeItem('userdetails')
        document.cookie = `otp =  ; expires = ; path= `;
        navigate('/signup')
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Enhanced Background with Multiple Gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
                <div className="absolute inset-0 bg-gradient-to-tr from-neon-purple/20 via-transparent to-neon-blue/20"></div>
                <div className="absolute inset-0 bg-gradient-to-bl from-neon-pink/10 via-transparent to-neon-purple/10"></div>
            </div>

            {/* Floating Orbs for Glass Effect */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-purple/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-blue/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-neon-pink/25 rounded-full blur-2xl animate-pulse delay-1000"></div>

            {/* Header */}
            <div className="absolute top-6 left-6 z-20">
                <Link to="/" className="flex items-center gap-3 group">
                    <Button variant="ghost" size="icon" className="rounded-full text-content-primary hover:text-neon-blue hover:bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg transition-all duration-300 group-hover:scale-110">
                        <Home className="h-5 w-5" />
                    </Button>
                    <span className="font-bold text-xl gradient-text flex items-center gap-2">

                        ProCollab
                    </span>
                </Link>
            </div>

            {/* Main Card */}
            <Card className="w-full max-w-md relative z-10 border-0 shadow-2xl backdrop-blur-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent">
                {/* Glossy Border Effect */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-neon-purple/50 via-neon-blue/50 to-neon-pink/50 p-[1px]">
                    <div className="w-full h-full rounded-lg bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 backdrop-blur-xl"></div>
                </div>

                {/* Inner Content */}
                <div className="relative z-10">
                    <CardHeader className="text-center space-y-4">
                        {/* Icon with Glow Effect */}
                        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center shadow-lg shadow-neon-purple/50 animate-glow">
                            <MailCheck className="h-8 w-8 text-white" />
                        </div>

                        <CardTitle className="text-3xl font-bold gradient-text text-center">
                            Email Verification
                        </CardTitle>
                        <CardDescription className="text-content-secondary text-center text-base">
                            Please enter the 6-digit code sent to<br />
                            <span className="text-content-primary font-medium text-neon-blue">{email}</span>
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-8">
                        <div className="space-y-4">
                            <Label htmlFor="otp" className="text-content-primary font-medium lead">Verification Code</Label>
                            <div className="flex justify-center py-6">
                                <InputOTP
                                    maxLength={6}
                                    value={otp}
                                    onChange={setOtp}
                                >
                                    <InputOTPGroup className="gap-3">
                                        {Array.from({ length: 6 }, (_, index) => (
                                            <InputOTPSlot
                                                key={index}
                                                index={index}
                                                className="w-12 h-12 text-lg font-bold bg-gradient-to-br from-white/20 to-white/5 border-white/30 backdrop-blur-sm shadow-lg hover:shadow-neon-purple/50 hover:border-neon-purple/50 transition-all duration-300 focus:ring-2 focus:ring-neon-purple/50 focus:border-neon-purple"
                                            />
                                        ))}
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>
                        </div>

                        <Button
                            onClick={handleVerify}
                            className="w-full h-12 bg-gradient-to-r from-neon-purple via-neon-blue to-neon-purple hover:from-neon-purple/80 hover:via-neon-blue/80 hover:to-neon-purple/80 text-white font-semibold shadow-lg shadow-neon-purple/50 hover:shadow-neon-purple/70 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/20"
                            disabled={isLoading || otp.length !== 6}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span className="animate-pulse">Verifying...</span>
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-3">
                                    <MailCheck className="h-5 w-5" />
                                    Verify Email
                                </span>
                            )}
                        </Button>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-6 border-t border-white/10 pt-6">
                        <p className="text-content-secondary text-sm text-center">
                            Didn't receive the code?{' '}
                            <Button
                                variant="link"
                                className="text-neon-blue hover:underline p-0 h-auto font-semibold hover:text-neon-purple transition-colors duration-300"
                                onClick={handleResendOTP}
                                disabled={isResending}
                            >
                                {isResending ? (
                                    <span className="flex items-center gap-2">
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                        Resending...
                                    </span>
                                ) : (
                                    'Resend code'
                                )}
                            </Button>
                        </p>

                        <Button
                            variant="ghost"
                            className="text-content-secondary hover:text-content-primary hover:bg-white/10 backdrop-blur-sm transition-all duration-300 border border-white/20 hover:border-white/30"
                            onClick={backToSignup}
                        >
                            Back to Sign Up
                        </Button>
                    </CardFooter>
                </div>
            </Card>
        </div>
    );
};

export default OTPVerification;
