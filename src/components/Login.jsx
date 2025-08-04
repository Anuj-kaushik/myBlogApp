import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as authLogin } from '../store/authSlice'
import { Button, Input, Logo } from "./index"
import { useDispatch } from "react-redux"
import authService from "../appwrite/auth"
import { useForm } from "react-hook-form"

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const login = async (data) => {
        setError("")
        setLoading(true)
        
        try {
            const session = await authService.login(data)
            if (session) {
                const userData = await authService.getCurrentUser()
                if (userData) {
                    dispatch(authLogin({ userData }))
                    navigate("/")
                }
            }
        } catch (error) {
            setError(error.message || "Login failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="mx-auto flex justify-center">
                        <Logo width="60px" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link
                            to="/signup"
                            className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                        >
                            Sign up for free
                        </Link>
                    </p>
                </div>
                
                <div className="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-100">
                    {error && (
                        <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200">
                            <p className="text-red-600 text-sm font-medium">{error}</p>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit(login)} className="space-y-6">
                        <div>
                            <Input
                                label="Email address"
                                placeholder="Enter your email"
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                        message: "Please enter a valid email address"
                                    }
                                })}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>
                        
                        <div>
                            <Input
                                label="Password"
                                type="password"
                                placeholder="Enter your password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters"
                                    }
                                })}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>
                        
                        <Button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Signing in...
                                </div>
                            ) : (
                                'Sign in'
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login