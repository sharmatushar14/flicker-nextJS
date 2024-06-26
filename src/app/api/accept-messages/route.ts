import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";   

export async function POST(request: Request){
    await dbConnect();

    const session = await getServerSession(authOptions);
    //We will find out the user from the session in which we stored through token and in token we inserted from user only

    const user: User = session?.user as User

    if(!session || !user){ //Comeback
        return Response.json({
            success: false,
            message: "Not Authenticated"
        },
        {
            status: 401
        }
    )
    }

    const userId = user._id;
    const {acceptMessages} = await request.json(); 
    //Important Note: backend was not updating the acceptmessages correcttly on the database, it was only changing
    //on the frontend, the issue was while doing await request.json(), at frontend I was passing 'acceptMessages' in the body of
    //axios post request but at backend I was doing const {accceptingMessages} = await request.json(), which was indeed
    //not matching. Hence always match the variable/const name while destructing as object over backend
    // console.log('Received acceptMessages:', acceptMessages);

    try {
        //Update the user's message acceptance status
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                isAcceptingMessages : acceptMessages
            },
            {
                new: true, //Will return the updatedUser
            }
        )
        if(!updatedUser){
           // User not found
      return Response.json(
        {
          success: false,
          message: 'Unable to find user to update message acceptance status',
        },
        { status: 404 }
      ); 
        }

        // console.log("Here:", updatedUser)

        //Succefully updated messages acceptance status
        return Response.json({
            sucess: true,
            message: "Message acceptance status updated successfully",
            updatedUser
        },
        {
            status: 200
        }
    )
    } catch (error) {
        console.error('Error updating message acceptance status:', error);
        return Response.json(
          { success: false, message: 'Error updating message acceptance status' },
          { status: 500 }
        );
      }
}


export async function GET(request: Request){
    //Connect to the database
    await dbConnect();

    //Get the user session
    const session = await getServerSession(authOptions);
    const user = session?.user;

    //Check if the user is authenticated

    if(!session || !user){
        return Response.json({
            success: false,
            message: "Not authenicated"
        },
        {
            status: 401
        }
    )
    }

    try {
        //Retrieve the user from the database using the ID
        const foundUser = await UserModel.findById(user._id);

        if(!foundUser){
            // User not found
             return Response.json(
             { success: false, message: 'User not found' },
             { status: 404 }
      );
       }
        //Return the user's message acceptance status
        return Response.json({
        success: true,
        isAcceptingMessages: foundUser?.isAcceptingMessages,
        },
        {
            status: 200
        }
    )
        
    } catch (error) {
        console.error("Error retrieving message acceptance status:", error);
        return Response.json(
            { success: false, message: 'Error retrieving message acceptance status' },
            { status: 500 }
        )
    }
}