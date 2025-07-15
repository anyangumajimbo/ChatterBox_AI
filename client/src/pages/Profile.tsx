import React, { useState } from 'react';
import { User, Mail, MapPin, Ruler, Edit, Save, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
    const { user, updateProfile, isLoading } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        country: user?.country || '',
        height: user?.height || 0,
        interests: user?.preferences?.interests || [],
        communicationStyle: user?.preferences?.communicationStyle || 'friendly',
        relationshipGoals: user?.preferences?.relationshipGoals || 'friendship',
        personalityTags: user?.personalityTags || [],
    });

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        try {
            await updateProfile({
                name: formData.name,
                country: formData.country,
                height: formData.height,
                preferences: {
                    interests: formData.interests,
                    communicationStyle: formData.communicationStyle,
                    relationshipGoals: formData.relationshipGoals,
                    ageRange: user?.preferences?.ageRange || { min: 18, max: 100 },
                    heightRange: user?.preferences?.heightRange || { min: 150, max: 200 },
                },
                personalityTags: formData.personalityTags,
            });
            toast.success('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            country: user?.country || '',
            height: user?.height || 0,
            interests: user?.preferences?.interests || [],
            communicationStyle: user?.preferences?.communicationStyle || 'friendly',
            relationshipGoals: user?.preferences?.relationshipGoals || 'friendship',
            personalityTags: user?.personalityTags || [],
        });
        setIsEditing(false);
    };

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

    if (!user) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
                        <p className="text-gray-600">Manage your account and preferences</p>
                    </div>
                    <div className="flex space-x-3">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    disabled={isLoading}
                                    className="btn-primary flex items-center"
                                >
                                    <Save size={16} className="mr-2" />
                                    {isLoading ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="btn-outline flex items-center"
                                >
                                    <X size={16} className="mr-2" />
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="btn-outline flex items-center"
                            >
                                <Edit size={16} className="mr-2" />
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                <div className="card p-8">
                    {/* Basic Information */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className="input"
                                    />
                                ) : (
                                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                        <User size={16} className="text-gray-400 mr-2" />
                                        <span className="text-gray-900">{user.name}</span>
                                    </div>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                    <Mail size={16} className="text-gray-400 mr-2" />
                                    <span className="text-gray-900">{user.email}</span>
                                </div>
                            </div>

                            {/* Country */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Country
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.country}
                                        onChange={(e) => handleInputChange('country', e.target.value)}
                                        className="input"
                                    />
                                ) : (
                                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                        <MapPin size={16} className="text-gray-400 mr-2" />
                                        <span className="text-gray-900">{user.country}</span>
                                    </div>
                                )}
                            </div>

                            {/* Height */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Height (cm)
                                </label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={formData.height}
                                        onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
                                        className="input"
                                    />
                                ) : (
                                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                        <Ruler size={16} className="text-gray-400 mr-2" />
                                        <span className="text-gray-900">{user.height}cm</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Preferences</h2>

                        {/* Communication Style */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Communication Style
                            </label>
                            {isEditing ? (
                                <select
                                    value={formData.communicationStyle}
                                    onChange={(e) => handleInputChange('communicationStyle', e.target.value)}
                                    className="input"
                                >
                                    <option value="casual">Casual</option>
                                    <option value="formal">Formal</option>
                                    <option value="friendly">Friendly</option>
                                    <option value="professional">Professional</option>
                                </select>
                            ) : (
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-900 capitalize">{user.preferences?.communicationStyle}</span>
                                </div>
                            )}
                        </div>

                        {/* Relationship Goals */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Relationship Goals
                            </label>
                            {isEditing ? (
                                <select
                                    value={formData.relationshipGoals}
                                    onChange={(e) => handleInputChange('relationshipGoals', e.target.value)}
                                    className="input"
                                >
                                    <option value="friendship">Friendship</option>
                                    <option value="romance">Romance</option>
                                    <option value="networking">Networking</option>
                                    <option value="casual">Casual</option>
                                </select>
                            ) : (
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-900 capitalize">{user.preferences?.relationshipGoals}</span>
                                </div>
                            )}
                        </div>

                        {/* Interests */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Interests
                            </label>
                            {isEditing ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {interests.map((interest: string) => (
                                        <label key={interest} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.interests.includes(interest)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        handleInputChange('interests', [...formData.interests, interest]);
                                                    } else {
                                                        handleInputChange('interests', formData.interests.filter((i: string) => i !== interest));
                                                    }
                                                }}
                                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">{interest}</span>
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {user.preferences?.interests.map((interest: string) => (
                                        <span
                                            key={interest}
                                            className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                                        >
                                            {interest}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Personality Tags */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Personality Traits
                            </label>
                            {isEditing ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {personalityTags.map((tag: string) => (
                                        <label key={tag} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.personalityTags.includes(tag)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        handleInputChange('personalityTags', [...formData.personalityTags, tag]);
                                                    } else {
                                                        handleInputChange('personalityTags', formData.personalityTags.filter((t: string) => t !== tag));
                                                    }
                                                }}
                                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">{tag}</span>
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {user.personalityTags.map((tag: string) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Account Information */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Information</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                <span className="text-gray-600">Member since</span>
                                <span className="text-gray-900">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                <span className="text-gray-600">Last updated</span>
                                <span className="text-gray-900">
                                    {new Date(user.updatedAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile; 