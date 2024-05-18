import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
//Todo: Zod verification

export async function POST(request: Request){
    await dbConnect();

    try {
        const {username, code} = await request.json();
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username: decodedUsername})

        if(!user){
            return Response.json({
                success: false,
                message: "User not Found"
            }, {
                status: 404
            })
        }

        //Check if the code is not expired and correct
        const isCodeValid = user.verifyCode==code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date(); //Come Back Here

        if(isCodeNotExpired && isCodeValid){
            //Update the user's verification status
            user.isVerified = true;
            await user.save();

            return Response.json(
                { success: true, message: 'Account verified successfully' },
                { status: 200 }
              );
        }

        else if(!isCodeValid){
            return Response.json(
                {
                  success: false,
                  message:
                    'Verification code has expired. Please sign up again to get a new code.',
                },
                { status: 400 }
              );
        }

        else {
            //Code not verified
            return Response.json(
                { success: false, message: 'Incorrect verification code' },
                { status: 400 }
              );
            }
    } catch (error) {
        console.error("Error verifying the User: ", error)
        return Response.json({
            success: false,
            message: "Error verifying the user"
        },
        {
            status: 500
        }
    )
    }
}