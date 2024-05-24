import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs';
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    const user: User = session?.user as User

    if(!session || !user){
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
          );
    }
  
    await dbConnect();
    const {username, newPassword, newPasswordConfirm} = await request.json();
    console.log(username, newPassword, newPasswordConfirm)
    const decodedUsername = decodeURIComponent(username);
    try {
        const user = await UserModel.findOne({username: decodedUsername});
        if(!user){
            return Response.json(
                {
                    message: "No account exists with this username",
                    success: false
                },
                {
                    status: 404
                }
            )
        }
        
        if(newPassword!==newPasswordConfirm){
            return Response.json({
                message: "Passwords do not match, try again",
                success: false
            },{
                status: 402
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.save();

        return Response.json({
            message: "Password Changed Successfully!",
            success: true
        },{
            status: 200
        })
    } catch (error) {
        return Response.json({
            message: "Error changing the passoword",
            success: false
        },
        {
            status: 500
       })
    }
}