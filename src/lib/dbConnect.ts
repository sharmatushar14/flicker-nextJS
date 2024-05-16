import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
 } //? suggests optional that the value may or may not exists

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    //Check if we have a connection to the database or if its currently connecting, because in
    //NextJs its unlike ReactJs, in NextJs, the database is connected every time the request is made unlike in
    //ReactJs frameworks where it is connected for once and will stay connected

    if(connection.isConnected){
        console.log("Already connected to the database");
        return;
    }

    try {
        //Attempt to connect to the database
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {})
        connection.isConnected = db.connections[0].readyState
        console.log("Database connection failed");
        
    } catch (error) {
        console.error("Database connection failed:", error)
        //Graceful exit in case of a connection error
        process.exit(1)
    }
}

export default dbConnect;