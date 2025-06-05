import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

// Simple fallback Card component
const Card = ({ children, className }) => (
  <div className={`bg-white p-6 rounded-2xl shadow-lg ${className || ""}`}>{children}</div>
);
const CardHeader = ({ children }) => <div className="mb-4">{children}</div>;
const CardTitle = ({ children, className }) => <h2 className={className}>{children}</h2>;
const CardContent = ({ children }) => <div>{children}</div>;

// Simple fallback Skeleton component
const Skeleton = ({ className }) => (
  <div className={className} style={{ background: "#eee", borderRadius: 4 }}>&nbsp;</div>
);

// Simple fallback Alert component
const Alert = ({ children, variant, className }) => (
  <div className={`p-4 border-l-4 ${variant === "destructive" ? "border-red-500 bg-red-50" : ""} ${className || ""}`}>
    {children}
  </div>
);
const AlertTitle = ({ children, className }) => <div className={className}>{children}</div>;
const AlertDescription = ({ children }) => <div>{children}</div>;

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/reports/analytics")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((json) => {
        // Transform { violation: count } ➜ [{ type, count }]
        const transformed = Object.entries(json).map(([type, count]) => ({ type, count }));
        setData(transformed);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <motion.div
      className="container mx-auto p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            Violation Analytics
          </CardTitle>
        </CardHeader>

        <CardContent>
          {loading && (
            <div className="space-y-4">
              <Skeleton className="h-8 w-2/3 mx-auto" />
              <Skeleton className="h-64 w-full" />
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="max-w-lg mx-auto">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="font-bold">Error loading analytics</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {data && (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(value) => [value, "Reports"]} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AnalyticsPage;
