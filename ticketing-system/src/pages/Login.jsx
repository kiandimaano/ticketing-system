import { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setToken, setRole } from '../services/storage';
import { AlertDestructive } from "@/components/ui/alert-destructive"

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessages] = useState('');

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessages('');

        try {
            const response = await axios.post(`${BACKEND_URL}/api/auth/login`, { email, password });
            if (response.status === 200) {
                if (response.data?.token) {
                    setToken(response.data.token);
                }
                if (response.data?.role) {
                    setRole(response.data.role);
                }
                navigate('/dashboard');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message ?? 'Login failed. Please try again';
            setErrorMessages(errorMessage);
            console.error('Login failed', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_1.4fr]">
            <div className="flex items-center justify-center bg-linear-to-br from-slate-50 via-white to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 px-8 py-10 sm:px-10 sm:py-12">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800">
                                Sign in to your account
                            </h2>
                            <p className="mt-2 text-sm text-slate-500">
                                Enter your credentials to continue
                            </p>
                        </div>

                        <form className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="sr-only">Email address</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        className="block w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400/30 focus:border-slate-400 focus:bg-white sm:text-sm"
                                        placeholder="Email address"
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="sr-only">Password</label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        value={password}
                                        className="block w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400/30 focus:border-slate-400 focus:bg-white sm:text-sm"
                                        placeholder="Password"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-slate-300 text-slate-600 focus:ring-slate-400/50"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
                                        Remember me
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <a href="#" className="font-medium text-slate-600 hover:text-slate-800 transition-colors">
                                        Forgot your password?
                                    </a>
                                </div>
                            </div>

                            {errorMessage && (
                                <AlertDestructive title="Error" description={errorMessage} />
                            )}

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-slate-800/25"
                                    onClick={handleSubmit}
                                >
                                    {loading ? 'Signing in...' : 'Sign in'}
                                </button>
                            </div>

                            <p className="text-center text-sm text-slate-500">
                                Don't have an account?{' '}
                                <a href="/register" className="font-medium text-slate-700 hover:text-slate-900 transition-colors">
                                    Sign up
                                </a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
            <div
                className="hidden lg:block min-h-screen w-full min-w-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(/login-bg.jpg)` }}
                aria-hidden="true"
            />
        </div>
    );
}

