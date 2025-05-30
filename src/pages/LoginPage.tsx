import React, { useState } from "react"
import { Link } from "react-router-dom"
import Header from "../components/Header"
import { z } from "zod"
import { useLogin } from "../hooks/useLoginHook"
import { Loader } from "lucide-react"

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters")
})

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState("")
    const { handleLogin, isLoading } = useLogin()
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
        form?: string;
    }>({})

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        try {
            loginSchema.parse({ email, password })
            setErrors({})
            handleLogin({ email, password })
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formattedErrors: { [key: string]: string } = {}
                error.errors.forEach((err) => {
                    const path = err.path[0] as string
                    formattedErrors[path] = err.message
                })
                setErrors(formattedErrors)
            }
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Sign in to your account
                        </h2>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div className="mb-4">
                                <label htmlFor="email-address" className="sr-only">Email address</label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>
                        </div>

                        {errors.form && (
                            <div className="text-red-500 text-sm text-center">{errors.form}</div>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                {isLoading ? <Loader className="animate-spin" size={20} /> : "Sign In"}
                            </button>
                        </div>
                    </form>

                    <div className="text-sm text-center mt-4">
                        <p className="text-gray-600">
                            Don't have an account?{" "}
                            <Link to="/signup" className="font-medium text-green-600 hover:text-green-500">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage