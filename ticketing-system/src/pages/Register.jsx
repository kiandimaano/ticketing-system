import { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AlertDestructive } from "@/components/ui/alert-destructive"

export default function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await axios.post(`${BACKEND_URL}/api/auth/register`, { username, email, password, });

            if (response.status === 201) {
                console.log('Registration successful');
                navigate('/login');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message ?? 'Registration failed. Please try again.';
            console.error('Registration failed', errorMessage);
            setError(errorMessage);
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
                                Create your account
                            </h2>
                            <p className="mt-2 text-sm text-slate-500">
                                Enter credentials to continue
                            </p>
                        </div>

                        {error && (
                            <AlertDestructive
                                title="Registration failed"
                                description={error}
                                className="max-w-md mb-6"
                            />
                        )}
                        <form className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="username" className="sr-only">Username</label>
                                    <input
                                        id="username"
                                        name="username"
                                        type="username"
                                        autoComplete="username"
                                        required
                                        value={username}
                                        className="block w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400/30 focus:border-slate-400 focus:bg-white sm:text-sm"
                                        placeholder="Username"
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
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

                            <div className="flex items-center justify-between pl-14">
                                <div className="flex items-center">
                                    <input
                                        id="terms-and-conditions"
                                        name="terms-and-conditions"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-slate-300 text-slate-600 focus:ring-slate-400/50"
                                    />
                                    <label htmlFor="terms-and-conditions" className="ml-2 block text-sm text-slate-600">
                                        Agree to terms and conditions
                                    </label>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    onClick={handleSubmit}
                                    className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-slate-800/25"
                                >
                                    {loading ? 'Signing up...' : 'Sign up'}
                                </button>
                            </div>

                            <p className="text-center text-sm text-slate-500">
                                Already have an account?{' '}
                                <a href="/login" className="font-medium text-slate-700 hover:text-slate-900 transition-colors">
                                    Sign in
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

