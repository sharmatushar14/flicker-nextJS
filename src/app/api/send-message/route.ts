import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";

export async function POST(request: Request){
    await dbConnect();
    const {username, content} = await request.json();

    try {
        const user = await UserModel.findOne({username}).exec();

        if(!user){
            return Response.json({
                message: 'User not found',
                success: false
            },{
                status: 404
            })
        }

     //Check if the user is accepting messages
     if(!user.isAcceptingMessages){
        return Response.json({
            message: "User is not accepting messages", success: false
        },
        {
            status: 403
        }
    )
     }

     //Sending message to the user
     const newMessage = { content, createdAt: new Date()};

     //Push the new message to the user's messages array
     user.messages.push(newMessage as Message);
     await user.save();

     return Response.json({
        success: true,
        message: "Message sent successfully"
     },
     {
        status: 201
     }    
    )
    } catch (error) {
        console.error('Error sending message:', error);
        return Response.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        ); 
    }
}