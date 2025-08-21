// src/components/dashboard/MetricCard.jsx
import React from "react";
import PropTypes from "prop-types";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export const MetricCard = ({
    title,
    value,
    change,
    changeType, // 'increase', 'decrease', or 'neutral'
    icon: Icon,
    iconColor = "text-indigo-600",
    iconBg = "bg-indigo-100",
}) => {
    const getChangeIcon = () => {
        switch (changeType) {
            case "increase":
                return <TrendingUp className="h-4 w-4 text-green-600" />;
            case "decrease":
                return <TrendingDown className="h-4 w-4 text-red-600" />;
            default:
                return <Minus className="h-4 w-4 text-gray-400" />;
        }
    };

    const getChangeColor = () => {
        switch (changeType) {
            case "increase":
                return "text-green-600";
            case "decrease":
                return "text-red-600";
            default:
                return "text-gray-600";
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        ₹{typeof value === "number" ? value.toLocaleString("en-IN") : value}
                    </p>
                    {change && (
                        <div className={`flex items-center mt-2 text-sm ${getChangeColor()}`}>
                            {getChangeIcon()}
                            <span className="ml-1">{change}</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${iconBg} ${iconColor}`}>
                    <Icon className="h-6 w-6" /> {/* ✅ used correctly */}
                </div>
            </div>
        </div>
    );
};

// ✅ PropTypes fix
MetricCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    change: PropTypes.string,
    changeType: PropTypes.oneOf(["increase", "decrease", "neutral"]),
    icon: PropTypes.elementType.isRequired, // 👈 THIS fixes 'Icon is missing in props validation'
    iconColor: PropTypes.string,
    iconBg: PropTypes.string,
};
