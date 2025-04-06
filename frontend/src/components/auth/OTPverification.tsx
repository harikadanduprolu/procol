
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot 
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MailCheck, RefreshCw } from 'lucide-react';

interface OTPVerificationProps {
  email: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ email, onSuccess, onCancel }) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);
      
      // For demo purposes, any 6-digit code is accepted
      toast({
        title: "Email Verified Successfully",
        description: "Your email has been verified. You can now proceed.",
        variant: "default",
      });
      
      onSuccess();
    }, 1500);
  };

  const handleResendOTP = () => {
    setIsResending(true);
    
    // Simulate sending new OTP
    setTimeout(() => {
      setIsResending(false);
      toast({
        title: "OTP Resent",
        description: `A new verification code has been sent to ${email}`,
        variant: "default",
      });
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md border-white/10 bg-surface-dark/70 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold gradient-text text-center">
          Email Verification
        </CardTitle>
        <CardDescription className="text-content-secondary text-center">
          Please enter the 6-digit code sent to<br />
          <span className="text-content-primary font-medium">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="otp">Verification Code</Label>
          <div className="flex justify-center py-4">
            <InputOTP 
              maxLength={6} 
              value={otp} 
              onChange={setOtp}
              render={({ slots }) => (
                <InputOTPGroup>
                  {slots.map((slot, index) => (
                    <InputOTPSlot key={index} {...slot} index={index} className="bg-background/50 border-white/20" />
                  ))}
                </InputOTPGroup>
              )}
            />
          </div>
        </div>
        
        <Button 
          onClick={handleVerify}
          className="w-full bg-neon-purple hover:bg-neon-purple/80 text-white"
          disabled={isLoading || otp.length !== 6}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              Verifying...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <MailCheck className="h-4 w-4" />
              Verify Email
            </span>
          )}
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t border-white/10 pt-4">
        <p className="text-content-secondary text-sm text-center">
          Didn't receive the code?{' '}
          <Button 
            variant="link" 
            className="text-neon-blue hover:underline p-0 h-auto font-medium"
            onClick={handleResendOTP}
            disabled={isResending}
          >
            {isResending ? (
              <span className="flex items-center gap-1">
                <RefreshCw className="h-3 w-3 animate-spin" />
                Resending...
              </span>
            ) : (
              'Resend code'
            )}
          </Button>
        </p>
        
        <Button 
          variant="ghost" 
          className="text-content-secondary hover:text-content-primary"
          onClick={onCancel}
        >
          Back to Sign Up
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OTPVerification;
