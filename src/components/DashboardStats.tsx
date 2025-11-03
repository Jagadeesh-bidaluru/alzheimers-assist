import { Patient } from "@/types/patient";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from "recharts";
import { TrendingUp, AlertTriangle, Clock, MapPin } from "lucide-react";

interface DashboardStatsProps {
  patients: Patient[];
  isNationalView: boolean;
  currentLocation?: string;
}

export const DashboardStats = ({ patients, isNationalView, currentLocation }: DashboardStatsProps) => {
  const stats = {
    total: patients.length,
    critical: patients.filter((p) => p.urgency === "critical").length,
    high: patients.filter((p) => p.urgency === "high").length,
    medium: patients.filter((p) => p.urgency === "medium").length,
    low: patients.filter((p) => p.urgency === "low").length,
    atRisk: patients.filter((p) => p.daysSinceDiagnosis > 90).length,
    diagnosed: patients.filter((p) => p.status === "diagnosed").length,
    scheduled: patients.filter((p) => p.status === "scheduled").length,
    inTreatment: patients.filter((p) => p.status === "in-treatment").length,
    completed: patients.filter((p) => p.status === "completed").length,
  };

  const urgencyData = [
    { name: "Critical", value: stats.critical, color: "hsl(var(--urgent))" },
    { name: "High", value: stats.high, color: "hsl(var(--warning))" },
    { name: "Medium", value: stats.medium, color: "hsl(var(--primary))" },
    { name: "Low", value: stats.low, color: "hsl(var(--success))" },
  ];

  const statusData = [
    { name: "Diagnosed", count: stats.diagnosed },
    { name: "Scheduled", count: stats.scheduled },
    { name: "In Treatment", count: stats.inTreatment },
    { name: "Completed", count: stats.completed },
  ];

  const locationData = Object.entries(
    patients.reduce((acc, patient) => {
      acc[patient.location] = (acc[patient.location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([location, count]) => ({ location, count }));

  const averageDays = patients.length > 0
    ? Math.round(patients.reduce((sum, p) => sum + p.daysSinceDiagnosis, 0) / patients.length)
    : 0;

  const conversionRate = stats.total > 0
    ? Math.round(((stats.inTreatment + stats.completed) / stats.total) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {isNationalView ? "National" : currentLocation} Patients
              </p>
              <p className="text-4xl font-bold text-foreground">{stats.total}</p>
              <p className="text-xs text-muted-foreground mt-2">Total in system</p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-urgent/10 to-urgent/5 border-urgent/20">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Critical + High</p>
              <p className="text-4xl font-bold text-urgent">{stats.critical + stats.high}</p>
              <p className="text-xs text-muted-foreground mt-2">Require immediate action</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-urgent" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">At Risk</p>
              <p className="text-4xl font-bold text-warning">{stats.atRisk}</p>
              <p className="text-xs text-muted-foreground mt-2">&gt;90 days since diagnosis</p>
            </div>
            <Clock className="w-8 h-8 text-warning" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Treatment Rate</p>
              <p className="text-4xl font-bold text-success">{conversionRate}%</p>
              <p className="text-xs text-muted-foreground mt-2">Started or completed</p>
            </div>
            <TrendingUp className="w-8 h-8 text-success" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Urgency Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={urgencyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {urgencyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Treatment Pipeline</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {isNationalView && (
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Patients by Location</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={locationData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis dataKey="location" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-l-4 border-l-primary">
          <p className="text-sm text-muted-foreground">Average Days Since Diagnosis</p>
          <p className="text-2xl font-bold text-foreground mt-1">{averageDays} days</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-success">
          <p className="text-sm text-muted-foreground">Conversion to Treatment</p>
          <p className="text-2xl font-bold text-foreground mt-1">{conversionRate}%</p>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.inTreatment + stats.completed} of {stats.total} patients
          </p>
        </Card>
        <Card className="p-4 border-l-4 border-l-warning">
          <p className="text-sm text-muted-foreground">Pending Treatment</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {stats.diagnosed + stats.scheduled}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Awaiting treatment start</p>
        </Card>
      </div>
    </div>
  );
};
