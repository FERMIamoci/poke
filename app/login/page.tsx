"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

import { signIn, signUp } from "@/utils/api";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
	email: z.string().email(),
	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters long" }),
});

export default function Login() {
	const [register, setRegister] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const { email, password } = values;
		register
			? await signUp(email, password)
			: await signIn(email, password);
	}

	const FormComponent = () => (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col border rounded-xl p-6 gap-4">
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									{...field}
									type="email"
									placeholder="you@example.com"
									required
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input
									{...field}
									type="password"
									placeholder="••••••••"
									required
								/>
							</FormControl>
							{register && (
								<FormDescription>
									Password must be at least 6 characters long.
								</FormDescription>
							)}
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">
					{register ? "Sign Up" : "Sign In"}
				</Button>
			</form>
		</Form>
	);

	return (
		<div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
			<h1 className="text-3xl font-bold">Welcome</h1>
			<p className="text-gray-500">
				{register
					? "Create an account to get started"
					: "Sign in to your account"}
			</p>
			<div className="flex gap-2">
				{"Sign in"}
				<Switch onCheckedChange={setRegister} checked={register} />
				{"Sign up"}
			</div>

			<FormComponent />
		</div>
	);
}
