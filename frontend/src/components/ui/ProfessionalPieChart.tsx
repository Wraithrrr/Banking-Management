'use client';

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend
} from 'recharts';

type PieDataPoint = {
    name: string;
    value: number;
    percentage: number;
    color: string;
};

interface ProfessionalPieChartProps {
    data: PieDataPoint[];
    showLegend?: boolean;
    showLabels?: boolean;
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                <p className="font-semibold text-gray-900">{data.name}</p>
                <p className="text-blue-600 font-bold">
                    {data.value.toFixed(1)}M transactions
                </p>
                <p className="text-sm text-gray-600">{data.percentage.toFixed(1)}% of total</p>
            </div>
        );
    }
    return null;
};

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            fontSize={16}
            fontWeight="bold"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export default function ProfessionalPieChart({
    data,
    showLegend = false,
    showLabels = true
}: ProfessionalPieChartProps) {
    return (
        <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={showLabels ? CustomLabel : false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    {showLegend && <Legend />}
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}