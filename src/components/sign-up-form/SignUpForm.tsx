"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Styles from "./sign-up-form.module.css";
import { Geist } from "next/font/google";

const font = Geist({ subsets: ["latin-ext"] });

const schema = z
    .object({
        name: z
            .string()
            .min(3, "Ім'я занадто коротке")
            .max(50, "Ім'я занадто довге"),
        email: z.string().email("Неправильний e-mail"),
        phone: z
            .string()
            .regex(
                /^\+?[0-9]{0,3}[\s.-]?[(]?[0-9]{3}[)]?[\s.-]?[0-9]{3}[\s.-]?[0-9]{4,6}$/,
                "Неправильний номер телефону"
            ),
        password: z
            .string()
            .min(3, "Пароль занадто короткий")
            .max(50, "Пароль занадто довгий"),
        confirmPassword: z.string(),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: "custom",
                message: "Паролі не співпадають",
                path: ["confirmPassword"],
            });
        }
    });

export function SignUpForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
    });

    const mutation = useMutation({
        mutationFn: async (data: z.infer<typeof schema>) => {
            const user = await fetch("http://localhost:8000/auth/register", {
                method: "POST",
                body: JSON.stringify({
                    name: data.name,
                    phone: data.phone,
                    email: data.email,
                    password: data.password,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return user;
        },
    });

    const onSubmit = async (data: z.infer<typeof schema>) => {
        const res = mutation.mutate(data);
        console.log(res);
    };

    return (
        <div className={`${Styles.wrapper} ${font.className}`}>
            <h1 className={Styles.headline}>Реєстрація</h1>
            <form className={Styles.form} onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label
                        className={`${Styles.label} ${font.className}`}
                        htmlFor="name"
                    >
                        Ім'я:
                    </label>
                    <input
                        className={Styles.input}
                        type="text"
                        placeholder="Ім'я"
                        {...register("name")}
                    />
                </div>
                <div>
                    <label
                        className={`${Styles.label} ${font.className}`}
                        htmlFor="phone"
                    >
                        Номер телефону:
                    </label>
                    <input
                        className={Styles.input}
                        type="text"
                        placeholder="Номер телефону"
                        {...register("phone")}
                    />
                </div>
                <div>
                    <label
                        className={`${Styles.label} ${font.className}`}
                        htmlFor="email"
                    >
                        Email:
                    </label>
                    <input
                        className={Styles.input}
                        type="text"
                        placeholder="E-mail"
                        {...register("email")}
                    />
                </div>
                <div>
                    <label
                        className={`${Styles.label} ${font.className}`}
                        htmlFor="password"
                    >
                        Пароль:
                    </label>
                    <input
                        className={Styles.input}
                        type="password"
                        placeholder="Пароль"
                        {...register("password")}
                    />
                </div>
                <div>
                    <label
                        className={`${Styles.label} ${font.className}`}
                        htmlFor="confirmPassword"
                    >
                        Підтвердження паролю:
                    </label>
                    <input
                        className={Styles.input}
                        type="password"
                        placeholder="Підтвердження паролю"
                        {...register("confirmPassword")}
                    />
                </div>
                <div className={Styles.errors}>
                    {errors.name && <p>{errors.name.message}</p>}
                    {errors.phone && <p>{errors.phone.message}</p>}
                    {errors.email && <p>{errors.email.message}</p>}
                    {errors.password && <p>{errors.password.message}</p>}
                    {errors.confirmPassword && (
                        <p>{errors.confirmPassword.message}</p>
                    )}
                </div>
                <div className={Styles.buttonBox}>
                    <input type="submit" value="Відправити" />
                </div>
            </form>
        </div>
    );
}
