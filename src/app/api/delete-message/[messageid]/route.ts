import dbConnect from "@/lib/dbConnect"
import { User, getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";

//IMPORTANT NOTE:
//In your Next.js API route using NextAuth.js, the correct method to get the current user's session is getServerSession when working with server-side code. 
//The useSession hook is intended for client-side usage. 
//This distinction is crucial because useSession relies on React hooks and can only be used within React components, not in API routes or server-side code.

export async function DELETE(request: Request,
    {params}: {params: {messageid: string}}
){
    const messageID = params.messageid
    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user: User = session?.user as User;
    if(!session || !_user){
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
       );
    }

    try {
        const updatedResult = await UserModel.updateOne(
            {_id: _user._id},
            {$pull: {messages: {_id: messageID}}}
            //The $pull operator removes from an existing array 
            //all instances of a value or values that match a specified condition

        )
        // console.log(updatedResult);
        
        if(updatedResult.modifiedCount===0){
            return Response.json(
                {message: "Message not found or already deleted", success: false},
                {status: 404}
            )       
        }

        //Mistake was: Ensure you return a `Response` or a `NextResponse` in all branches of your handler.
        return NextResponse.json({
            message: "Message Deleted Successfully",
            success: true
        }, {
            status: 200
        })

    } catch (error) {
        console.error('Error deleting the message:', error)
        return Response.json(
           {message: "Error deleting the message", success: false},
           {status: 500}
        )
    }
}