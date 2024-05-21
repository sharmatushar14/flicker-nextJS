import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiRespone";
import VerificationEmail from "../../email/VerificationEmail";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'Tushar <onboarding@resend.dev>',
            to: email,
            subject: 'Flicker Message Verification Code',
            react: VerificationEmail({username, otp: verifyCode})
        })
        return {success: true,
            message: "Verification email sent successfully!"
        }
    } catch (error) {
        console.log("Error sending verification email:", error);
        return {
            success: false,
            message: "Failed to send verification code"
        }
    }
}