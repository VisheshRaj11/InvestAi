import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

interface TrendChartProps {
  data: { date: string; close: number }[];
}

export function TrendChart({ data }: TrendChartProps) {
  if (!data || data.length === 0) return <div className="text-gray-400 flex items-center justify-center h-full">No data available</div>;

  const formattedData = data.map(d => ({
    ...d,
    formattedDate: new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
  }));

  const min = Math.min(...formattedData.map(d => d.close));
  const max = Math.max(...formattedData.map(d => d.close));
  
  // Calculate buffer for Y axis
  const buffer = (max - min) * 0.1;

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#4ADE80" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis 
            dataKey="formattedDate" 
            hide 
          />
          <YAxis 
            domain={[Math.max(0, min - buffer), max + buffer]} 
            hide 
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg flex flex-col items-center">
                    <div className="text-xs text-gray-500 font-medium mb-1">{payload[0].payload.formattedDate}</div>
                    <div className="font-bold text-gray-900 tabular-nums">Price: ${Number(payload[0].value).toFixed(2)}</div>
                  </div>
                );
              }
              return null;
            }}
            cursor={{ stroke: '#9CA3AF', strokeWidth: 1, strokeDasharray: '3 3' }}
          />
          <Area 
            type="monotone" 
            dataKey="close" 
            stroke="#22C55E" 
            strokeWidth={2} 
            fillOpacity={1} 
            fill="url(#colorClose)" 
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
