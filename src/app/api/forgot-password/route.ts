import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(request: Request){
    await dbConnect();

    try {
        const {email} = await request.json();

        const user = await UserModel.findOne({
            email: email
        })

        if(!user){
            return Response.json(
                {message: "No account found with this email ID",
                 success: false
                },
                {status: 404}
            )
        }
        
        let verifyCode = Math.floor((Math.random()*900000)+100000).toString();
        
        user.verifyCode = verifyCode;
        user.verifyCodeExpiry = new Date(Date.now()+360000);
        user.isPasswordChanging=true;
        await user.save();
        // console.log(user)
        const emailSend = await sendVerificationEmail(user.email, user.verifyCode, user.username);

        if(!emailSend.success){
            return Response.json({
                success: false,
                message: "Failed to send the OTP to the registered email ID"
            },{
                status: 500
            })
        }

        return Response.json({
            message: "Details related to the email fetched successfully!",
            success: true,
            user,
            emailSendMessage: emailSend.message,
        },
        {
            status: 200
        }
    )

    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Error fetching the account for the emailID"
            },
            {
                status: 404
            }
        ) 
    }
}