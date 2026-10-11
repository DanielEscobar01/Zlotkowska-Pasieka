import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Receives sales series already grouped from order-item price snapshots.
export default function SalesTrendChart({ data, series, range, onRangeChange, labels }) {
  const ranges = [
    ["7d", labels.last7Days],
    ["30d", labels.last30Days],
    ["12m", labels.last12Months],
    ["all", labels.allTime],
  ];

  return (
    <section className="admin-sales-chart" aria-labelledby="admin-sales-chart-title">
      <header className="admin-sales-chart-header">
        <div>
          <h3 id="admin-sales-chart-title">{labels.salesTrend}</h3>
          <p>{labels.revenue}</p>
        </div>
        <div className="admin-sales-range" role="group" aria-label={labels.chartRange}>
          {ranges.map(([value, title]) => (
            <button
              key={value}
              type="button"
              aria-pressed={range === value}
              onClick={() => onRangeChange(value)}
            >
              {title}
            </button>
          ))}
        </div>
      </header>
      {series.length === 0 ? (
        <p className="admin-chart-empty">{labels.chartEmpty}</p>
      ) : (
        <div className="admin-sales-chart-frame">
          <ResponsiveContainer width="100%" height={340}>
            <LineChart data={data} margin={{ top: 10, right: 18, bottom: 4, left: 4 }}>
              <CartesianGrid stroke="rgba(37, 37, 41, 0.1)" strokeDasharray="3 5" vertical={false} />
              <XAxis
                dataKey="label"
                axisLine={{ stroke: "rgba(37, 37, 41, 0.16)" }}
                tickLine={false}
                tick={{ fill: "#5c5d65", fontSize: 11 }}
                minTickGap={24}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#5c5d65", fontSize: 11 }}
                tickFormatter={(value) => `${Math.round(Number(value))} zł`}
                width={68}
              />
              <Tooltip
                formatter={(value, name) => [`${Number(value ?? 0).toFixed(2)} zł`, name]}
                labelStyle={{ color: "#252529", fontWeight: 700 }}
                contentStyle={{ border: "1px solid rgba(37, 37, 41, 0.14)", borderRadius: 5 }}
              />
              <Legend verticalAlign="bottom" height={42} wrapperStyle={{ fontSize: 11 }} />
              {series.map((item) => (
                <Line
                  key={item.key}
                  type="monotone"
                  dataKey={item.key}
                  name={item.label}
                  stroke={item.color}
                  strokeWidth={2.5}
                  dot={{ r: 4, strokeWidth: 2, fill: "#ffffff" }}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}