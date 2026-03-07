import type { ReactNode } from 'react';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

interface CardProps {
    readonly title: string;
    readonly value: string;
    readonly icon: ReactNode;
    readonly gradient: string;
    readonly subtitle?: string;
    readonly trend?: {
        readonly value: string;
        readonly isPositive: boolean;
    };
}

function Card({ title, value, icon, gradient, subtitle, trend }: Readonly<CardProps>) {
    return (
        <div className={`relative p-6 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 ${gradient}`}>
            <div className="absolute inset-0 opacity-10">
                <div className="absolute -right-4 -top-4 text-6xl opacity-20">
                    {icon}
                </div>
            </div>

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div className="text-2xl text-white/90">
                        {icon}
                    </div>
                    {trend && (
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${trend.isPositive
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-red-500/20 text-red-300'
                            }`}>
                            {trend.isPositive ? (
                                <FiTrendingUp className="w-3 h-3" />
                            ) : (
                                <FiTrendingDown className="w-3 h-3" />
                            )}
                            <span>{trend.value}</span>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <h3 className="text-white/80 text-sm font-medium uppercase tracking-wide">
                        {title}
                    </h3>
                    <p className="text-white text-2xl font-bold">
                        {value}
                    </p>
                    {subtitle && (
                        <p className="text-white/60 text-xs">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Card;