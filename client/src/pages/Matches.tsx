import React, { useEffect } from 'react';
import { Heart, MessageCircle, MapPin, Ruler } from 'lucide-react';
import { useMatchStore } from '../store/matchStore';
import { IMatchResult } from '../shared/types';
import toast from 'react-hot-toast';

const Matches: React.FC = () => {
    const { matches, isLoading, error, findMatches, sendMatchRequest } = useMatchStore();

    useEffect(() => {
        findMatches();
    }, [findMatches]);

    const handleSendMatchRequest = async (targetUserId: string) => {
        try {
            await sendMatchRequest(targetUserId);
            toast.success('Match request sent!');
        } catch (error) {
            toast.error('Failed to send match request');
        }
    };

    const renderMatchCard = (match: IMatchResult) => (
        <div key={match.user._id} className="card p-6">
            <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {match.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{match.user.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <div className="flex items-center">
                                <MapPin size={14} className="mr-1" />
                                {match.user.country}
                            </div>
                            <div className="flex items-center">
                                <Ruler size={14} className="mr-1" />
                                {match.user.height}cm
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">
                        {match.compatibilityScore}%
                    </div>
                    <div className="text-sm text-gray-500">Compatibility</div>
                </div>
            </div>

            {/* Shared Interests */}
            {match.sharedInterests.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Shared Interests</h4>
                    <div className="flex flex-wrap gap-2">
                        {match.sharedInterests.map((interest: string) => (
                            <span
                                key={interest}
                                className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                            >
                                {interest}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Match Reasons */}
            {match.matchReasons.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Why you match</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                        {match.matchReasons.map((reason: string, index: number) => (
                            <li key={index} className="flex items-center">
                                <Heart size={12} className="text-red-500 mr-2" />
                                {reason}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex space-x-3">
                <button
                    onClick={() => match.user._id && handleSendMatchRequest(match.user._id)}
                    className="flex-1 btn-primary flex items-center justify-center"
                >
                    <Heart size={16} className="mr-2" />
                    Send Match Request
                </button>
                <button className="btn-outline flex items-center justify-center">
                    <MessageCircle size={16} className="mr-2" />
                    Message
                </button>
            </div>
        </div>
    );

    return (
        <div className="h-full bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Matches</h1>
                    <p className="text-gray-600">
                        Discover people who share your interests and preferences
                    </p>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Finding your perfect matches...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                        {error}
                    </div>
                )}

                {/* Matches Grid */}
                {!isLoading && matches.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {matches.map((match: IMatchResult) => renderMatchCard(match))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && matches.length === 0 && !error && (
                    <div className="text-center py-12">
                        <Heart size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No matches found</h3>
                        <p className="text-gray-500">
                            We're working on finding people who match your preferences.
                            Check back later or update your profile to improve matching.
                        </p>
                    </div>
                )}

                {/* Refresh Button */}
                {!isLoading && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={() => findMatches()}
                            className="btn-outline"
                        >
                            Refresh Matches
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Matches; 