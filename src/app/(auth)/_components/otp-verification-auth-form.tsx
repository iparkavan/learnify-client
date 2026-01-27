import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { OtpSchema, OtpSchemaType } from "@/schema/auth-schema";
import { Button } from "@/components/ui/button";
import {
  useLoginSendOtp,
  useSignupSendOtp,
  useVerifyOtp,
} from "@/hooks/auth-hook";
import { useSearchParams } from "next/navigation";
import { useUserInfoStore } from "@/store/userInfo-store";
import { ACCESS_TOKEN, UserRole } from "@/utils/contants";
import Cookies from "js-cookie";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

const RESEND_OTP_TIME = 30; // seconds

const OtpVerificationAuthForm = ({
  email,
  name,
  onResendOTP,
}: {
  email: string;
  name: string;
  onResendOTP?: (data: { email: string; name: string }) => void;
}) => {
  const searchParams = useSearchParams();

  const action = searchParams.get("action");

  const isSignup = action === "signup";

  // const redirectTo = searchParams.get("redir") || "/";
  const rawRedirect = searchParams.get("redir");
  const redirectTo = rawRedirect ? decodeURIComponent(rawRedirect) : "/";

  const { user, setUser } = useUserInfoStore();

  const [timeLeft, setTimeLeft] = useState<number>(RESEND_OTP_TIME);
  const [canResend, setCanResend] = useState<boolean>(false);

  const [error, setError] = useState<string>("");
  const {
    mutate: loignSendOtpMutate,
    isPending: isLoginPending,
    // error: loginError,
  } = useLoginSendOtp();
  const { mutate: signupSendOtpMutate, isPending: isSignupPending } =
    useSignupSendOtp();
  const { mutate: verifyMutate, isPending } = useVerifyOtp();

  useEffect(() => {
    if (timeLeft === 0) {
      setCanResend(true);
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  const otpForm = useForm({
    resolver: zodResolver(OtpSchema),
    defaultValues: {
      pin: "",
    },
  });

  const resendOTPHandler = () => {
    if (!canResend) return;
    if (isPending) return;

    if (action === "signup") {
      signupSendOtpMutate(
        {
          email,
          name,
        },
        {
          onSuccess: (data) => {
            console.log("OTP sent successfully : ", data);

            setTimeLeft(RESEND_OTP_TIME);
            setCanResend(false);

            // setEmail(data.email);
            // setName(data.name ?? "");
            // setIsOtpStep(true);
          },
          onError: (error: any) => {
            if (error?.response?.status === 400) {
              setError(error?.response?.data?.message);
            }
          },
        },
      );
      return;
    }

    loignSendOtpMutate(
      { email },
      {
        onSuccess: (data) => {
          // setEmail(data.email);
          // setName(data.name ?? "");
          // setIsOtpStep(true);
          setTimeLeft(RESEND_OTP_TIME);
          setCanResend(false);
        },
        onError: (error: any) => {
          console.log(error?.response?.data?.message);
          if (error?.response?.status === 404) {
            setError(error?.response?.data?.message);
          }
        },
      },
    );
  };

  const onOTPSubmit = (data: OtpSchemaType) => {
    if (isPending) return;

    verifyMutate(
      {
        email,
        otp: data.pin,
        name,
        type: "STUDENT",
      },
      {
        onSuccess: (data) => {
          if (data.token) {
            Cookies.set(ACCESS_TOKEN, data.token);
          }

          setUser(data.user);

          const { user } = data;

          console.log("user.role", user.role);

          // STUDENT
          if (user.role === UserRole.STUDENT) {
            if (!user.studentProfile) {
              window.location.replace("/student-profile-setup");
              return;
            }
            window.location.replace(redirectTo);
            return;
          }

          // INSTRUCTOR
          if (user.role === UserRole.INSTRUCTOR) {
            if (!user.instructorProfile) {
              window.location.replace("/instructor-profile-setup");
              return;
            }
            window.location.replace("/instructor");
            return;
          }

          // ADMIN
          // router.replace("/admin/dashboard");
        },

        // onSuccess: (data) => {
        //   if (data.token) {
        //     Cookies.set(ACCESS_TOKEN, data.token);
        //   }
        //   setUser(data.user);
        //   // const userRole = data.user.role;

        //   // if (userRole === UserRole.ADMIN) router.push("/admin/dashboard");
        //   // else if (userRole === UserRole.INSTRUCTOR)
        //   //   router.push("/instructor/courses");
        //   // else
        //   // router.push(redirectTo);
        //   window.location.href = redirectTo;
        // },
        onError: (error: any) => {
          if (error?.response?.status === 400) {
            setError(error?.response?.data?.message);
          }
        },
      },
    );
  };

  return (
    <div>
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Enter verification code</CardTitle>
          <CardDescription>
            Enter the 6-digit code we sent to{" "}
            <span className="font-semibold text-muted-foreground">{email}</span>{" "}
            to finish your{" "}
            <span className="text-muted-foreground">
              {isSignup ? "registration." : "login."}
            </span>
          </CardDescription>
          {error && (
            <div className="text-red-600 text-sm font-semibold">{error}</div>
          )}
        </CardHeader>
        <CardContent className="text-center">
          <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(onOTPSubmit)}>
              <FieldGroup>
                <Field>
                  <div className="flex flex-col items-center justify-center">
                    <FormField
                      control={otpForm.control}
                      name="pin"
                      render={({ field }) => (
                        <FormItem className="flex items-center flex-col justify-between">
                          {/* <FormLabel>One-Time Password</FormLabel> */}
                          <FormControl autoFocus>
                            <InputOTP maxLength={6} {...field}>
                              <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                              </InputOTPGroup>
                              <InputOTPSeparator />
                              <InputOTPGroup>
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                              </InputOTPGroup>
                            </InputOTP>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FieldDescription>
                    Enter the 6-digit code sent to your email.
                  </FieldDescription>
                </Field>
                <FieldGroup>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader className="h-4 w-4 animate-spin" /> Verifying...
                      </span>
                    ) : (
                      "Verify Code"
                    )}
                  </Button>
                  <FieldDescription className="text-center">
                    {!canResend ? (
                      <>
                        Resend OTP in&nbsp;
                        <span className="text-primary font-semibold">
                          {timeLeft}
                        </span>
                        s
                      </>
                    ) : (
                      <div>
                        Didn&apos;t receive the code?{" "}
                        <Link
                          href="#"
                          className="underline hover:text-primary"
                          onClick={() => resendOTPHandler()}
                        >
                          {isLoginPending || isSignupPending
                            ? "Sending..."
                            : "Resend"}
                        </Link>
                      </div>
                    )}
                  </FieldDescription>
                </FieldGroup>
              </FieldGroup>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OtpVerificationAuthForm;
