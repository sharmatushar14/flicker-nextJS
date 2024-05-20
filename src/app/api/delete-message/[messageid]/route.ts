import dbConnect from "@/lib/dbConnect"
import { User, getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/model/User";

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
        if(updatedResult.modifiedCount===0){
            return Response.json(
                {message: "Message not found or already deleted", success: false},
                {status: 404}
            )       
        }
    } catch (error) {
        console.error('Error deleting the message:', error)
        return Response.json(
           {message: "Error deleting the message", success: false},
           {status: 500}
        )
    }
}