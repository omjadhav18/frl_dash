import { useState } from "react";
import { 
  BarChart3, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  Download, 
  Settings,
  Plus,
  Trash2,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Area,
  AreaChart,
  ScatterChart,
  Scatter,
  ComposedChart,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

const Analytics = () => {
  const [selectedQTables, setSelectedQTables] = useState<string[]>([]);
  const [chartType, setChartType] = useState<"line" | "bar" | "area" | "scatter">("line");
  const [selectedMetric, setSelectedMetric] = useState("performance");
  const [chartTitle, setChartTitle] = useState("Performance Comparison");
  const [savedCharts, setSavedCharts] = useState<any[]>([]);
  const { toast } = useToast();

  // Mock Q-Table data for comparison
  const availableQTables = [
    { id: "GQ-2024-001", name: "Urban Navigation v2.4.1", performance: 94.7 },
    { id: "GQ-2024-002", name: "Highway Driving v2.4.0", performance: 92.3 },
    { id: "GQ-2024-003", name: "Parking Maneuvers v2.3.9", performance: 91.5 },
    { id: "GQ-2024-004", name: "Emergency Response v2.3.8", performance: 90.1 },
    { id: "GQ-2024-005", name: "Mixed Scenarios v2.4.1", performance: 93.8 },
  ];

  // Mock comparison data
  const comparisonData = [
    { 
      episode: 100, 
      "Urban Navigation": 85, 
      "Highway Driving": 82, 
      "Parking Maneuvers": 80,
      "Emergency Response": 78,
      "Mixed Scenarios": 83
    },
    { 
      episode: 200, 
      "Urban Navigation": 87, 
      "Highway Driving": 85, 
      "Parking Maneuvers": 83,
      "Emergency Response": 81,
      "Mixed Scenarios": 86
    },
    { 
      episode: 300, 
      "Urban Navigation": 90, 
      "Highway Driving": 88, 
      "Parking Maneuvers": 86,
      "Emergency Response": 84,
      "Mixed Scenarios": 89
    },
    { 
      episode: 400, 
      "Urban Navigation": 92, 
      "Highway Driving": 90, 
      "Parking Maneuvers": 88,
      "Emergency Response": 87,
      "Mixed Scenarios": 91
    },
    { 
      episode: 500, 
      "Urban Navigation": 94, 
      "Highway Driving": 92, 
      "Parking Maneuvers": 91,
      "Emergency Response": 89,
      "Mixed Scenarios": 93
    },
    { 
      episode: 600, 
      "Urban Navigation": 95, 
      "Highway Driving": 93, 
      "Parking Maneuvers": 92,
      "Emergency Response": 90,
      "Mixed Scenarios": 94
    },
  ];

  // Colors for different Q-tables
  const colors = [
    "hsl(var(--primary))",
    "hsl(var(--accent))", 
    "hsl(var(--success))",
    "hsl(var(--warning))",
    "hsl(var(--destructive))",
  ];

  const handleQTableSelection = (qTableId: string) => {
    setSelectedQTables(prev => 
      prev.includes(qTableId)
        ? prev.filter(id => id !== qTableId)
        : [...prev, qTableId]
    );
  };

  const handleSaveChart = () => {
    const newChart = {
      id: `chart-${Date.now()}`,
      title: chartTitle,
      type: chartType,
      metric: selectedMetric,
      qTables: selectedQTables,
      createdAt: new Date().toISOString(),
    };

    setSavedCharts(prev => [...prev, newChart]);
    
    toast({
      title: "Chart Saved",
      description: `"${chartTitle}" has been saved to your analytics dashboard.`,
    });
  };

  const handleDeleteChart = (chartId: string) => {
    setSavedCharts(prev => prev.filter(chart => chart.id !== chartId));
    toast({
      title: "Chart Deleted",
      description: "Chart has been removed from your dashboard.",
    });
  };

  const renderChart = () => {
    const filteredData = comparisonData.map(item => {
      const filtered: any = { episode: item.episode };
      selectedQTables.forEach(qTableId => {
        const qTable = availableQTables.find(q => q.id === qTableId);
        if (qTable) {
          filtered[qTable.name.split(' ')[0]] = item[qTable.name.split(' ')[0] as keyof typeof item];
        }
      });
      return filtered;
    });

    const chartProps = {
      data: filteredData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case "line":
        return (
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="episode" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--popover))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px" 
              }} 
            />
            <Legend />
            {selectedQTables.map((qTableId, index) => {
              const qTable = availableQTables.find(q => q.id === qTableId);
              if (!qTable) return null;
              const key = qTable.name.split(' ')[0];
              return (
                <Line 
                  key={qTableId}
                  type="monotone" 
                  dataKey={key} 
                  stroke={colors[index % colors.length]} 
                  strokeWidth={2}
                  name={qTable.name}
                />
              );
            })}
          </LineChart>
        );

      case "bar":
        return (
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="episode" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--popover))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px" 
              }} 
            />
            <Legend />
            {selectedQTables.map((qTableId, index) => {
              const qTable = availableQTables.find(q => q.id === qTableId);
              if (!qTable) return null;
              const key = qTable.name.split(' ')[0];
              return (
                <Bar 
                  key={qTableId}
                  dataKey={key} 
                  fill={colors[index % colors.length]} 
                  name={qTable.name}
                />
              );
            })}
          </BarChart>
        );

      case "area":
        return (
          <AreaChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="episode" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--popover))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px" 
              }} 
            />
            <Legend />
            {selectedQTables.map((qTableId, index) => {
              const qTable = availableQTables.find(q => q.id === qTableId);
              if (!qTable) return null;
              const key = qTable.name.split(' ')[0];
              return (
                <Area 
                  key={qTableId}
                  type="monotone" 
                  dataKey={key} 
                  stroke={colors[index % colors.length]} 
                  fill={colors[index % colors.length]}
                  fillOpacity={0.3}
                  strokeWidth={2}
                  name={qTable.name}
                />
              );
            })}
          </AreaChart>
        );

      default:
        return <div className="flex items-center justify-center h-64 text-muted-foreground">Select Q-tables to compare</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Create custom analytics and compare Q-table performance across different scenarios
        </p>
      </div>

      {/* Chart Builder */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Configuration Panel */}
        <Card className="lg:col-span-1 shadow-soft border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Settings className="h-5 w-5 text-primary" />
              Chart Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Chart Title */}
            <div className="space-y-2">
              <Label htmlFor="chartTitle" className="text-sm font-medium">Chart Title</Label>
              <Input
                id="chartTitle"
                value={chartTitle}
                onChange={(e) => setChartTitle(e.target.value)}
                placeholder="Enter chart title..."
                className="border-border focus:border-primary transition-smooth"
              />
            </div>

            {/* Chart Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Chart Type</Label>
              <Select value={chartType} onValueChange={(value: any) => setChartType(value)}>
                <SelectTrigger className="border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">
                    <div className="flex items-center gap-2">
                      <LineChartIcon className="h-4 w-4" />
                      Line Chart
                    </div>
                  </SelectItem>
                  <SelectItem value="bar">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Bar Chart
                    </div>
                  </SelectItem>
                  <SelectItem value="area">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Area Chart
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Metric Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Metric</Label>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="performance">Performance Score</SelectItem>
                  <SelectItem value="reward">Cumulative Reward</SelectItem>
                  <SelectItem value="convergence">Convergence Rate</SelectItem>
                  <SelectItem value="stability">Q-Value Stability</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Q-Table Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Select Q-Tables to Compare</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {availableQTables.map((qTable, index) => (
                  <div key={qTable.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={qTable.id}
                      checked={selectedQTables.includes(qTable.id)}
                      onCheckedChange={() => handleQTableSelection(qTable.id)}
                      className="border-border mt-1"
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor={qTable.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {qTable.name}
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Performance: {qTable.performance}%
                      </p>
                    </div>
                    <div 
                      className="w-3 h-3 rounded-full ml-auto mt-1" 
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button 
                onClick={handleSaveChart}
                disabled={selectedQTables.length === 0}
                className="w-full gradient-primary text-white shadow-glow hover:shadow-strong transition-smooth"
              >
                <Plus className="mr-2 h-4 w-4" />
                Save Chart
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full transition-smooth"
                disabled={selectedQTables.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Chart Display */}
        <Card className="lg:col-span-2 shadow-soft border-border">
          <CardHeader>
            <CardTitle className="text-foreground">{chartTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedQTables.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                {renderChart()}
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <PieChartIcon className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Select Q-Tables to Compare</h3>
                <p className="text-muted-foreground">
                  Choose one or more Q-tables from the configuration panel to create your analytics chart
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Saved Charts */}
      <Card className="shadow-soft border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Saved Analytics Charts</CardTitle>
        </CardHeader>
        <CardContent>
          {savedCharts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="font-semibold text-foreground">Chart Title</TableHead>
                  <TableHead className="font-semibold text-foreground">Type</TableHead>
                  <TableHead className="font-semibold text-foreground">Metric</TableHead>
                  <TableHead className="font-semibold text-foreground">Q-Tables</TableHead>
                  <TableHead className="font-semibold text-foreground">Created</TableHead>
                  <TableHead className="font-semibold text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {savedCharts.map((chart) => (
                  <TableRow key={chart.id} className="hover:bg-muted/20 transition-quick">
                    <TableCell className="font-medium text-primary">{chart.title}</TableCell>
                    <TableCell className="capitalize">{chart.type}</TableCell>
                    <TableCell className="capitalize">{chart.metric}</TableCell>
                    <TableCell className="text-sm">{chart.qTables.length} selected</TableCell>
                    <TableCell className="text-sm">
                      {new Date(chart.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="hover:bg-accent hover:text-accent-foreground transition-smooth"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteChart(chart.id)}
                          className="hover:bg-destructive hover:text-destructive-foreground transition-smooth"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Saved Charts</h3>
              <p className="text-muted-foreground">
                Create and save your first analytics chart to see it here
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;