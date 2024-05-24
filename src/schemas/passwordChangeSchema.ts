import NewPassword from '@/app/(auth)/new-password/[username]/page';
import {z} from 'zod';

export const passwordChangeSchema = z.object({
    newPassword: z.string().min(6, "Password must be 6 characters long"),
    newPasswordConfirm: z.string().min(6, "Password must be 6 characters long"),
})