'use client';

import {
    ResponsiveContainer,
    LineChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Line,
    Area,
    AreaChart,
} from 'recharts';

type DataPoint = { name: string; value: number };

interface ProfessionalLineChartProps {
    data: DataPoint[];
    lineColor?: string;
    areaFill?: boolean;
    showDots?: boolean;
    strokeWidth?: number;
    yAxisLabel?: string;
    showGrid?: boolean;
    minValue?: number;
    maxValue?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const value = payload[0].value;

        return (
            <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                <p className="font-semibold text-gray-900">{label}</p>
                <p className="text-blue-600 font-bold text-lg">
                    {value.toFixed(1)}%
                </p>
                {value >= 100 && (
                    <p className="text-green-600 text-xs mt-1">✓ Above minimum</p>
                )}
                {value < 100 && (
                    <p className="text-red-600 text-xs mt-1">⚠ Below minimum</p>
                )}
            </div>
        );
    }
    return null;
};

export default function ProfessionalLineChart({
    data,
    lineColor = '#3B82F6',
    areaFill = true,
    showDots = true,
    strokeWidth = 3,
    yAxisLabel = '',
    showGrid = true,
    minValue,
    maxValue,
}: ProfessionalLineChartProps) {

    const formatYAxis = (value: number) => {
        return `${value}%`;
    };

    // Calculate domain with padding
    const dataValues = data.map(d => d.value);
    const calculatedMin = minValue !== undefined ? minValue : Math.floor(Math.min(...dataValues) * 0.95);
    const calculatedMax = maxValue !== undefined ? maxValue : Math.ceil(Math.max(...dataValues) * 1.05);

    const ChartComponent = areaFill ? AreaChart : LineChart;

    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
                <ChartComponent
                    data={data}
                    margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                >
                    {showGrid && (
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                            vertical={false}
                        />
                    )}
                    <XAxis
                        dataKey="name"
                        tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }}
                        axisLine={{ stroke: '#D1D5DB' }}
                        tickLine={{ stroke: '#D1D5DB' }}
                    />
                    <YAxis
                        tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }}
                        axisLine={{ stroke: '#D1D5DB' }}
                        tickLine={{ stroke: '#D1D5DB' }}
                        tickFormatter={formatYAxis}
                        domain={[calculatedMin, calculatedMax]}
                        label={yAxisLabel ? {
                            value: yAxisLabel,
                            angle: -90,
                            position: 'insideLeft',
                            style: { fill: '#6B7280', fontSize: 12, fontWeight: 600 }
                        } : undefined}
                    />
                    <Tooltip
                        cursor={{ stroke: lineColor, strokeWidth: 1, strokeDasharray: '5 5' }}
                        content={<CustomTooltip />}
                    />

                    {/* Reference line for regulatory minimum (100%) */}
                    <Line
                        type="monotone"
                        dataKey={() => 100}
                        stroke="#EF4444"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        name="Regulatory Min"
                    />

                    {areaFill ? (
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={lineColor}
                            strokeWidth={strokeWidth}
                            fill={lineColor}
                            fillOpacity={0.1}
                            dot={showDots ? {
                                fill: lineColor,
                                strokeWidth: 2,
                                stroke: '#fff',
                                r: 4
                            } : false}
                            activeDot={{
                                r: 6,
                                fill: lineColor,
                                stroke: '#fff',
                                strokeWidth: 2
                            }}
                        />
                    ) : (
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={lineColor}
                            strokeWidth={strokeWidth}
                            dot={showDots ? {
                                fill: lineColor,
                                strokeWidth: 2,
                                stroke: '#fff',
                                r: 4
                            } : false}
                            activeDot={{
                                r: 6,
                                fill: lineColor,
                                stroke: '#fff',
                                strokeWidth: 2
                            }}
                        />
                    )}
                </ChartComponent>
            </ResponsiveContainer>
        </div>
    );
}
