// src/pages/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
    Mic, BarChart3, Brain, MessageSquare, Shield, TrendingUp,
    ArrowRight, Play, Users, Award, Clock, Zap
} from 'lucide-react';

export default function LandingPage() {
    const features = [
        {
            icon: <Mic className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
            title: "Voice Expense Tracking",
            description: "Simply speak to add expenses. 'Add $15 for lunch at Cafe Coffee Day' is all it takes."
        },
        {
            icon: <BarChart3 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
            title: "Smart Analytics",
            description: "Visualize your spending patterns with interactive charts and personalized insights."
        },
        {
            icon: <Brain className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
            title: "AI-Powered Advice",
            description: "Get personalized financial recommendations based on your spending habits and goals."
        },
        {
            icon: <MessageSquare className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
            title: "Voice Conversations",
            description: "Ask questions and get voice responses about your finances in natural language."
        },
        {
            icon: <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
            title: "Security First",
            description: "Bank-level encryption keeps your financial data safe and secure at all times."
        },
        {
            icon: <TrendingUp className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
            title: "Goal Planning",
            description: "Set financial goals and let our AI create a personalized plan to help you achieve them."
        }
    ];

    const stats = [
        { icon: <Users className="h-6 w-6" />, value: "50,000+", label: "Active Users" },
        { icon: <Award className="h-6 w-6" />, value: "98%", label: "Satisfaction Rate" },
        { icon: <Clock className="h-6 w-6" />, value: "5M+", label: "Hours Saved" },
        { icon: <Zap className="h-6 w-6" />, value: "30%", label: "Average Savings" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
            {/* Hero Section */}
            <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="mb-8 flex justify-center">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                            <Mic className="h-4 w-4 mr-2" />
                            AI-Powered Voice Finance Assistant
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                        Manage Your Finances <br />
                        <span className="text-indigo-600 dark:text-indigo-400">With Your Voice</span>
                    </h1>

                    <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Join 50,000+ users who are transforming their financial lives with our AI-powered voice assistant.
                        Track expenses, get personalized advice, and achieve your goals through simple voice commands.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Link
                            to="/signup"
                            className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors text-lg flex items-center justify-center shadow-lg hover:shadow-xl"
                        >
                            Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                        <button className="px-8 py-4 border border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 rounded-lg font-medium hover:bg-indigo-50 dark:hover:bg-gray-800 transition-colors text-lg flex items-center justify-center">
                            <Play className="mr-2 h-5 w-5" /> Watch Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-white dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="flex justify-center text-indigo-600 dark:text-indigo-400 mb-3">
                                    {stat.icon}
                                </div>
                                <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Powerful Features</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Everything you need to take control of your finances with the power of your voice
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                                <div className="bg-indigo-100 dark:bg-indigo-900/30 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 bg-indigo-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">What Our Users Say</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Sarah Chen",
                                role: "Software Engineer",
                                content: "FinVoice saved me 10+ hours per month on expense tracking. The voice commands make it so effortless!",
                                rating: 5
                            },
                            {
                                name: "Michael Rodriguez",
                                role: "Freelancer",
                                content: "The AI advice helped me save 30% more each month. I've never been this organized with my finances.",
                                rating: 5
                            },
                            {
                                name: "Emily Thompson",
                                role: "Marketing Manager",
                                content: "The security features give me peace of mind. I can track everything by voice without worrying about privacy.",
                                rating: 5
                            }
                        ].map((testimonial, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                                <div className="flex justify-center mb-4">
                                    {'⭐'.repeat(testimonial.rating)}
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-4 italic">"{testimonial.content}"</p>
                                <div>
                                    <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                                    <div className="text-sm text-indigo-600 dark:text-indigo-400">{testimonial.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 rounded-2xl p-8 md:p-12 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Financial Life?</h2>
                    <p className="text-lg text-indigo-100 max-w-2xl mx-auto mb-8">
                        Join 50,000+ users who are already taking control of their finances with the power of voice and AI.
                        Start your free trial today - no credit card required.
                    </p>
                    <Link
                        to="/signup"
                        className="inline-block px-8 py-4 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors text-lg shadow-lg hover:shadow-xl"
                    >
                        Start Your Free Trial
                    </Link>
                    <p className="mt-4 text-sm text-indigo-200">7-day free trial • Cancel anytime</p>
                </div>
            </section>
        </div>
    );
}