"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Styles from "./login-form.module.css";
import { Geist } from "next/font/google";
import { useMutation, useQuery } from "@tanstack/react-query";

const font = Geist({ subsets: ["latin-ext"] });

const schema = z.object({
    email: z.string().email("Неправильний e-mail"),
    password: z
        .string()
        .min(3, "Пароль занадто короткий")
        .max(50, "Пароль занадто довгий")
});

export function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
    });

    const mutation = useMutation({
        mutationFn: async (data: z.infer<typeof schema>) => {
            const user = await fetch("http://localhost:8000/auth/login", {
                method: "POST",
                body: JSON.stringify({
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

    const onSubmit = (loginData: z.infer<typeof schema>) => {
        const data = mutation.mutate(loginData);
        console.log(data);
    };

    return (
        <div className={`${Styles.wrapper} ${font.className}`}>
            <h1 className={Styles.headline}>Авторизація</h1>
            <form className={Styles.form} onSubmit={handleSubmit(onSubmit)}>
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
                <div className={Styles.errors}>
                    {errors.email && <p>{errors.email.message}</p>}
                    {errors.password && <p>{errors.password.message}</p>}
                </div>
                <div className={Styles.buttonBox}>
                    <input type="submit" value="Відправити" />
                </div>
            </form>
        </div>
    );
}
