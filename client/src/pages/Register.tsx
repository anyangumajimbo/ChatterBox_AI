import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock, Eye, EyeOff, MapPin, Ruler } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { RegistrationFormData } from '../shared/types';
import toast from 'react-hot-toast';

const Register: React.FC = () => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const navigate = useNavigate();
    const { register: registerUser, isLoading, error, clearError } = useAuthStore();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegistrationFormData>();

    const password = watch('password');

    const onSubmit = async (data: RegistrationFormData) => {
        try {
            // Transform data for API
            const userData = {
                name: data.name,
                email: data.email,
                password: data.password,
                country: data.country,
                height: data.height,
                preferences: {
                    interests: data.interests,
                    communicationStyle: data.communicationStyle,
                    relationshipGoals: data.relationshipGoals,
                    ageRange: data.ageRange,
                    heightRange: data.heightRange,
                },
                personalityTags: data.personalityTags,
            };

            await registerUser(userData);
            toast.success('Registration successful!');
            navigate('/chat');
        } catch (error) {
            // Error is handled by the store
        }
    };

    React.useEffect(() => {
        clearError();
    }, [clearError]);

    const countries = [
        'Kenya', 'France', 'United States', 'United Kingdom', 'Germany', 'Canada',
        'Australia', 'Japan', 'South Korea', 'India', 'Brazil', 'Mexico', 'Italy',
        'Spain', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Switzerland'
    ];

    const interests = [
        'Technology', 'Music', 'Sports', 'Travel', 'Cooking', 'Reading',
        'Gaming', 'Art', 'Photography', 'Fitness', 'Movies', 'Dancing',
        'Writing', 'Languages', 'Science', 'History', 'Politics', 'Fashion',
        'Nature', 'Volunteering', 'Business', 'Education', 'Health', 'Food'
    ];

    const personalityTags = [
        'Extroverted', 'Introverted', 'Creative', 'Analytical', 'Adventurous',
        'Cautious', 'Optimistic', 'Realistic', 'Empathetic', 'Direct',
        'Humorous', 'Serious', 'Spontaneous', 'Planned', 'Independent',
        'Collaborative', 'Traditional', 'Progressive', 'Energetic', 'Calm'
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Join
                    </h2>
                    <h1 className="text-4xl font-bold gradient-text mb-4">
                        ChatterBox AI
                    </h1>
                    <p className="text-gray-600">
                        Create your account and start connecting with AI and people
                    </p>
                </div>

                <div className="card p-8">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        {...register('name', {
                                            required: 'Name is required',
                                            minLength: {
                                                value: 2,
                                                message: 'Name must be at least 2 characters',
                                            },
                                        })}
                                        type="text"
                                        className="input pl-10"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email Address
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Invalid email address',
                                            },
                                        })}
                                        type="email"
                                        className="input pl-10"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        {...register('password', {
                                            required: 'Password is required',
                                            minLength: {
                                                value: 6,
                                                message: 'Password must be at least 6 characters',
                                            },
                                        })}
                                        type={showPassword ? 'text' : 'password'}
                                        className="input pl-10 pr-10"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                    Confirm Password
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        {...register('confirmPassword', {
                                            required: 'Please confirm your password',
                                            validate: (value) =>
                                                value === password || 'Passwords do not match',
                                        })}
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        className="input pl-10 pr-10"
                                        placeholder="Confirm your password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            {/* Country Field */}
                            <div>
                                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                    Country
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <select
                                        {...register('country', {
                                            required: 'Country is required',
                                        })}
                                        className="input pl-10"
                                    >
                                        <option value="">Select your country</option>
                                        {countries.map((country: string) => (
                                            <option key={country} value={country}>
                                                {country}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.country && (
                                    <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                                )}
                            </div>

                            {/* Height Field */}
                            <div>
                                <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                                    Height (cm)
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Ruler className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        {...register('height', {
                                            required: 'Height is required',
                                            min: { value: 100, message: 'Height must be at least 100cm' },
                                            max: { value: 250, message: 'Height cannot exceed 250cm' },
                                        })}
                                        type="number"
                                        className="input pl-10"
                                        placeholder="Enter your height in cm"
                                    />
                                </div>
                                {errors.height && (
                                    <p className="mt-1 text-sm text-red-600">{errors.height.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Interests Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Interests (select multiple)
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {interests.map((interest: string) => (
                                    <label key={interest} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            value={interest}
                                            {...register('interests', {
                                                required: 'Please select at least one interest',
                                            })}
                                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">{interest}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.interests && (
                                <p className="mt-1 text-sm text-red-600">{errors.interests.message}</p>
                            )}
                        </div>

                        {/* Communication Style */}
                        <div>
                            <label htmlFor="communicationStyle" className="block text-sm font-medium text-gray-700">
                                Communication Style
                            </label>
                            <select
                                {...register('communicationStyle', {
                                    required: 'Communication style is required',
                                })}
                                className="input"
                            >
                                <option value="">Select your communication style</option>
                                <option value="casual">Casual</option>
                                <option value="formal">Formal</option>
                                <option value="friendly">Friendly</option>
                                <option value="professional">Professional</option>
                            </select>
                            {errors.communicationStyle && (
                                <p className="mt-1 text-sm text-red-600">{errors.communicationStyle.message}</p>
                            )}
                        </div>

                        {/* Relationship Goals */}
                        <div>
                            <label htmlFor="relationshipGoals" className="block text-sm font-medium text-gray-700">
                                Relationship Goals
                            </label>
                            <select
                                {...register('relationshipGoals', {
                                    required: 'Relationship goals are required',
                                })}
                                className="input"
                            >
                                <option value="">Select your relationship goals</option>
                                <option value="friendship">Friendship</option>
                                <option value="romance">Romance</option>
                                <option value="networking">Networking</option>
                                <option value="casual">Casual</option>
                            </select>
                            {errors.relationshipGoals && (
                                <p className="mt-1 text-sm text-red-600">{errors.relationshipGoals.message}</p>
                            )}
                        </div>

                        {/* Personality Tags */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Personality Traits (select multiple)
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {personalityTags.map((tag: string) => (
                                    <label key={tag} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            value={tag}
                                            {...register('personalityTags', {
                                                required: 'Please select at least one personality trait',
                                            })}
                                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">{tag}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.personalityTags && (
                                <p className="mt-1 text-sm text-red-600">{errors.personalityTags.message}</p>
                            )}
                        </div>

                        {/* Age Range */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="ageRange.min" className="block text-sm font-medium text-gray-700">
                                    Minimum Age Preference
                                </label>
                                <input
                                    {...register('ageRange.min', {
                                        required: 'Minimum age is required',
                                        min: { value: 18, message: 'Minimum age must be at least 18' },
                                        max: { value: 100, message: 'Minimum age cannot exceed 100' },
                                    })}
                                    type="number"
                                    className="input"
                                    placeholder="18"
                                />
                                {errors.ageRange?.min && (
                                    <p className="mt-1 text-sm text-red-600">{errors.ageRange.min.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="ageRange.max" className="block text-sm font-medium text-gray-700">
                                    Maximum Age Preference
                                </label>
                                <input
                                    {...register('ageRange.max', {
                                        required: 'Maximum age is required',
                                        min: { value: 18, message: 'Maximum age must be at least 18' },
                                        max: { value: 100, message: 'Maximum age cannot exceed 100' },
                                    })}
                                    type="number"
                                    className="input"
                                    placeholder="100"
                                />
                                {errors.ageRange?.max && (
                                    <p className="mt-1 text-sm text-red-600">{errors.ageRange.max.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Height Range */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="heightRange.min" className="block text-sm font-medium text-gray-700">
                                    Minimum Height Preference (cm)
                                </label>
                                <input
                                    {...register('heightRange.min', {
                                        required: 'Minimum height is required',
                                        min: { value: 100, message: 'Minimum height must be at least 100cm' },
                                        max: { value: 250, message: 'Minimum height cannot exceed 250cm' },
                                    })}
                                    type="number"
                                    className="input"
                                    placeholder="150"
                                />
                                {errors.heightRange?.min && (
                                    <p className="mt-1 text-sm text-red-600">{errors.heightRange.min.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="heightRange.max" className="block text-sm font-medium text-gray-700">
                                    Maximum Height Preference (cm)
                                </label>
                                <input
                                    {...register('heightRange.max', {
                                        required: 'Maximum height is required',
                                        min: { value: 100, message: 'Maximum height must be at least 100cm' },
                                        max: { value: 250, message: 'Maximum height cannot exceed 250cm' },
                                    })}
                                    type="number"
                                    className="input"
                                    placeholder="200"
                                />
                                {errors.heightRange?.max && (
                                    <p className="mt-1 text-sm text-red-600">{errors.heightRange.max.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creating account...' : 'Create account'}
                        </button>
                    </form>

                    {/* Sign In Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="font-medium text-primary-600 hover:text-primary-500"
                            >
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register; 