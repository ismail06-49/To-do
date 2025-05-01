import * as z from 'zod';

export const RegisterSchema = z.object({
    name: z.string().min(2, { message: 'Name is required' }),
    email: z.string().email({ message: 'Email is required' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' })
})

export const LoginSchema = z.object({
    email: z.string().email({ message: 'Email is required' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' })
})

export const ProfileSchema = z.object({
    name: z.optional(z.string()),
    email: z.optional(z.string()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
    profile: z.optional(z.instanceof(File)
        .refine(file => file.size < 5 * 1024 * 1024, {
            message: 'حجم الصورة يجب أن يكون أقل من 5 ميغابايت',
        })
        .refine(file => ['image/jpeg', 'image/png', 'image/gif'].includes(file.type), {
            message: 'نوع الصورة غير مدعوم. يجب أن تكون صورة JPEG أو PNG أو GIF',
        }))
})
    .refine((data) => {
        if (data.password && !data.newPassword) {
            return false;
        }
        return true;
    }, {
        message: "يجب إدخال كلمة المرور الجديدة",
        path: ["newPassword"],
    })
    .refine((data) => {
        if (data.newPassword && !data.password) {
            return false;
        }
        return true;
    }, {
        message: "يجب إدخال كلمة المرور الحالية",
        path: ["password"],
    });