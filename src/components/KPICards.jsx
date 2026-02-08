import React from 'react';
import { CheckCircle, AlertTriangle, FileText, XCircle, TrendingUp } from 'lucide-react';
import clsx from 'clsx';

const KPICard = ({ title, value, icon: Icon, type, subtext, trend }) => {
    const styles = {
        default: "bg-white border-slate-200 text-slate-600",
        primary: "bg-gradient-to-br from-blue-500 to-blue-600 text-white border-transparent shadow-blue-500/20",
        success: "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-transparent shadow-emerald-500/20",
        danger: "bg-gradient-to-br from-red-500 to-red-600 text-white border-transparent shadow-red-500/20",
        warning: "bg-gradient-to-br from-amber-500 to-orange-600 text-white border-transparent shadow-orange-500/20",
    };

    const themeClass = styles[type] || styles.default;
    const isWhiteText = type !== 'default';

    return (
        <div className={clsx(
            "p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group",
            themeClass
        )}>
            {/* Background Pattern */}
            {isWhiteText && (
                <div className="absolute -bottom-4 -right-4 p-4 opacity-10 transform rotate-12 group-hover:scale-110 transition-transform">
                    <Icon className="w-24 h-24" />
                </div>
            )}

            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <p className={clsx("text-sm font-semibold tracking-wide uppercase opacity-90", isWhiteText ? "text-white/80" : "text-slate-500")}>
                        {title}
                    </p>
                    <div className="flex items-baseline gap-2 mt-2">
                        <h3 className={clsx("text-3xl font-bold", isWhiteText ? "text-white" : "text-slate-800")}>
                            {value}
                        </h3>
                        {trend && (
                            <span className="flex items-center text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                                <TrendingUp className="w-3 h-3 mr-1" /> {trend}
                            </span>
                        )}
                    </div>
                    {subtext && (
                        <p className={clsx("text-xs mt-3 font-medium", isWhiteText ? "text-white/90" : "text-slate-400")}>
                            {subtext}
                        </p>
                    )}
                </div>

            </div>
        </div>
    );
};

const KPICards = ({ data }) => {
    const total = data.length;
    const compliant = data.filter(d => d.Dropdown === 'Yes').length;
    const nonCompliant = data.filter(d => d.Dropdown === 'No').length;
    const riskPercentage = total > 0 ? ((nonCompliant / compliant) * 100).toFixed(1) : 0;
    const isCritical = parseFloat(riskPercentage) > 10;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
                title="Total Records"
                value={total}
                icon={FileText}
                type="primary"
                subtext="Total entries loaded"
            />
            <KPICard
                title="Compliant"
                value={compliant}
                icon={CheckCircle}
                type="success"
                subtext="Adhering to standards"
            />
            <KPICard
                title="Non-Compliant"
                value={nonCompliant}
                icon={XCircle}
                type="danger"
                subtext="Requires attention"
            />
            <KPICard
                title="Critical Breach %"
                value={`${riskPercentage}%`}
                icon={AlertTriangle}
                type={isCritical ? "danger" : "warning"} // Red if >10%, Orange otherwise to indicate caution
                subtext={isCritical ? "⚠️ CRITICAL LEVEL (>10%)" : "Monitor closely"}
                trend={isCritical ? "+2.5%" : "-1.2%"} // Mock trend for visual
            />
        </div>
    );
};

export default KPICards;
