import { useState, useEffect } from "react";
import { Users, PlayCircle, Database, TrendingUp } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import apiInstance from "@/utils/axiosall";

interface SummaryCounts {
  federated_runs: number;
  client_qtables: number;
  global_qtables: number;
  test_results: number;
}

const Dashboard = () => {
  const [counts, setCounts] = useState<SummaryCounts>({
    federated_runs: 0,
    client_qtables: 0,
    global_qtables: 0,
    test_results: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSummaryCounts();
  }, []);

  const fetchSummaryCounts = async () => {
    setLoading(true);
    try {
      const { data } = await apiInstance.get("/federated/summary/counts/");
      setCounts(data);
    } catch (error) {
      console.error("Failed to fetch summary counts:", error);
    } finally {
      setLoading(false);
    }
  };

  const metrics = [
    {
      title: "Total Federated Runs",
      value: counts.client_qtables,
      description: "Federated runs completed count",
      icon: Users,
      trend: { value: 12, isPositive: true },
    },
    {
      title: "Client Q-Tables",
      value: counts.federated_runs,
      description: "Total Client Q",
      icon: PlayCircle,
      trend: { value: 8, isPositive: true },
    },
    {
      title: "Global Q-Tables Generated",
      value: counts.global_qtables,
      description: "Aggregated models",
      icon: Database,
      trend: { value: 3, isPositive: true },
    },
    {
      title: "Test Results Generated",
      value: counts.test_results,
      description: "Performance evaluations",
      icon: TrendingUp,
      trend: { value: 2, isPositive: true },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your federated learning network performance
        </p>
      </div>

      {/* Metrics Grid */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading metrics...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
      )}

      {/* Additional Dashboard Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-lg shadow-soft p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {[
              { time: "2 minutes ago", event: "Client C-001 completed training run", status: "success" },
              { time: "5 minutes ago", event: "Global Q-Table aggregation started", status: "warning" },
              { time: "12 minutes ago", event: "Client C-015 joined the network", status: "success" },
              { time: "18 minutes ago", event: "Performance evaluation completed", status: "success" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {activity.event}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
                <div
                  className={`h-2 w-2 rounded-full ${
                    activity.status === "success"
                      ? "bg-success"
                      : activity.status === "warning"
                      ? "bg-warning"
                      : "bg-destructive"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-card border border-border rounded-lg shadow-soft p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            System Status
          </h3>
          <div className="space-y-4">
            {[
              { component: "Federation Server", status: "Operational", uptime: "99.9%" },
              { component: "Q-Table Storage", status: "Operational", uptime: "100%" },
              { component: "Aggregation Engine", status: "Operational", uptime: "99.7%" },
              { component: "Performance Monitor", status: "Operational", uptime: "100%" },
            ].map((system, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {system.component}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Uptime: {system.uptime}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-success" />
                  <span className="text-xs font-medium text-success">
                    {system.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;