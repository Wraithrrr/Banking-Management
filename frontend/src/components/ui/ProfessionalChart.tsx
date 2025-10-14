'use client';

import {
    ResponsiveContainer,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Bar
} from 'recharts';

type DataPoint = { name: string; value: number };

interface ProfessionalChartProps {
    data: DataPoint[];
    barColor?: string; // tailwind color hex or CSS color
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const value = payload[0].value;
        const isPercentage = value >= 90 && value <= 100;
        const isTime = value < 10 && value > 0;
        const isResponseTime = value > 50 && value < 500;

        let displayValue = value.toFixed(2);
        let unit = '';

        if (isPercentage) {
            unit = '%';
        } else if (isResponseTime) {
            unit = 'ms';
        } else if (isTime) {
            unit = ' min';
        }

        return (
            <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                <p className="font-semibold text-gray-900">{label}</p>
                <p className="text-blue-600 font-bold">
                    {displayValue}{unit}
                </p>
                {isPercentage && value < 99.5 && (
                    <p className="text-red-500 text-xs">Below target</p>
                )}
                {isResponseTime && value > 200 && (
                    <p className="text-orange-500 text-xs">Above target</p>
                )}
            </div>
        );
    }
    return null;
};

export default function ProfessionalChart({ data, barColor = '#1e3a8a' }: ProfessionalChartProps) {
    // Auto-format Y-axis based on data type
    const formatYAxis = (value: number) => {
        if (value >= 90 && value <= 100) {
            return `${value.toFixed(1)}%`;
        } else if (value > 50 && value < 500) {
            return `${value.toFixed(0)}ms`;
        } else if (value < 10 && value > 0) {
            return `${value.toFixed(0)}m`;
        }
        return value.toString();
    };

    return (
        <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="name"
                        tick={{ fill: '#374151', fontSize: 12, fontWeight: 500 }}
                        axisLine={{ stroke: '#d1d5db' }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        interval={0}
                    />
                    <YAxis
                        tick={{ fill: '#374151', fontSize: 14, fontWeight: 500 }}
                        axisLine={{ stroke: '#d1d5db' }}
                        tickFormatter={formatYAxis}
                        domain={['dataMin - 1', 'dataMax + 1']}
                    />
                    <Tooltip
                        cursor={{ fill: 'rgba(30,58,138,0.06)' }}
                        content={<CustomTooltip />}
                    />
                    <Bar
                        dataKey="value"
                        radius={[6, 6, 0, 0]}
                        fill={barColor}
                        stroke={barColor}
                        strokeWidth={1}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
