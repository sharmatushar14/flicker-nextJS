import { Message } from "@/model/User";

export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean; //Optional
    messages?: Array<Message> //Optional
}