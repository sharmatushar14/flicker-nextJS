import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs';


export async function POST(request: Request){
    await dbConnect();

    try {
        const {username, email, password} = await request.json();
        const existingVerifiedUserByUsername = await UserModel.findOne({username,
            isVerified: true
        })

        if(existingVerifiedUserByUsername){
            return Response.json({
                success: false,
                message: "User already exists with this username"
            },{
                status: 400
            })
        }

        const existingUserByEmail = await UserModel.findOne({email});
        let verifyCode = Math.floor((Math.random()*900000)+100000).toString()
        //Range: 100000 and 999999

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "User already exists with this email",
                    status: 400
                },{
                    status: 400
                })
            } else {
                //Email exists but is not verified
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save()
            }
        } else {
            //New User Registration
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate =  new Date();
            expiryDate.setHours(expiryDate.getHours()+1); //Indeed we are using const but its object using new keyword, hence can be modified with const too
            
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: []
            })
            await newUser.save()
        }
        
        //For the new user and non verified users, send the verification email
        const emailResponse = await sendVerificationEmail(
            email,
            verifyCode,
            username
        );
        if(!emailResponse.success){
            return Response.json({
                success: false,
                message: emailResponse.message
            },
        {
            status: 500
        })
        }

        return Response.json({
            success: true,
            message: "User registered successfully. Please verify your account"
        }, {
            status: 200
        })
     
    } catch (error) {
        console.error("Error registering the user:", error);
        return Response.json(
            {
                success: false,
                message: "Error registering the user",
            },
            {
                status: 500
            }
        )      
    }
}