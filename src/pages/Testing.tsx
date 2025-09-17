import { useState } from "react";
import { Play, Pause, RotateCcw, Car, MapPin, Timer, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
} from "recharts";
import { useToast } from "@/hooks/use-toast";

const Testing = () => {
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const { toast } = useToast();

  // Mock testing data
  const testResults = [
    {
      carId: "CAR-001",
      testId: "TEST-2024-001",
      scenario: "Urban Navigation",
      startTime: "2024-01-15 14:30:00",
      duration: "12:34",
      status: "completed",
      score: 94.7,
      episodes: 1000,
      avgReward: 0.847,
    },
    {
      carId: "CAR-002", 
      testId: "TEST-2024-002",
      scenario: "Highway Driving",
      startTime: "2024-01-15 13:15:00",
      duration: "08:22",
      status: "completed",
      score: 89.3,
      episodes: 800,
      avgReward: 0.793,
    },
    {
      carId: "CAR-003",
      testId: "TEST-2024-003", 
      scenario: "Parking Maneuvers",
      startTime: "2024-01-15 15:45:00",
      duration: "05:16",
      status: "running",
      score: 0,
      episodes: 342,
      avgReward: 0.623,
    },
  ];

  // Performance over time data
  const performanceData = [
    { episode: 0, car1: 20, car2: 25, car3: 18 },
    { episode: 100, car1: 35, car2: 40, car3: 30 },
    { episode: 200, car1: 45, car2: 50, car3: 42 },
    { episode: 300, car1: 60, car2: 58, car3: 55 },
    { episode: 400, car1: 72, car2: 70, car3: 68 },
    { episode: 500, car1: 82, car2: 79, car3: 75 },
    { episode: 600, car1: 88, car2: 85, car3: 82 },
    { episode: 700, car1: 91, car2: 89, car3: 87 },
    { episode: 800, car1: 94, car2: 92, car3: 89 },
    { episode: 900, car1: 95, car2: 93, car3: 91 },
    { episode: 1000, car1: 97, car2: 94, car3: 92 },
  ];

  // Scenario distribution data
  const scenarioData = [
    { name: "Urban Navigation", value: 35, color: "hsl(var(--primary))" },
    { name: "Highway Driving", value: 28, color: "hsl(var(--accent))" },
    { name: "Parking", value: 20, color: "hsl(var(--success))" },
    { name: "Emergency", value: 17, color: "hsl(var(--warning))" },
  ];

  // Reward distribution data
  const rewardData = [
    { episode: 1, reward: 0.2 },
    { episode: 50, reward: 0.35 },
    { episode: 100, reward: 0.42 },
    { episode: 150, reward: 0.58 },
    { episode: 200, reward: 0.61 },
    { episode: 250, reward: 0.73 },
    { episode: 300, reward: 0.78 },
    { episode: 350, reward: 0.85 },
    { episode: 400, reward: 0.89 },
    { episode: 450, reward: 0.91 },
    { episode: 500, reward: 0.94 },
  ];

  const handleStartTest = () => {
    setIsTestRunning(true);
    setCurrentTest("Urban Navigation - CAR-004");
    toast({
      title: "Test Started",
      description: "Beginning urban navigation scenario for CAR-004",
    });
  };

  const handleStopTest = () => {
    setIsTestRunning(false);
    setCurrentTest(null);
    toast({
      title: "Test Stopped",
      description: "Current test has been terminated",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success text-success-foreground">Completed</Badge>;
      case "running":
        return <Badge className="bg-warning text-warning-foreground animate-pulse">Running</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 75) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Car Testing Environment</h1>
        <p className="text-muted-foreground">
          Test and validate federated learning models in real-world driving scenarios
        </p>
      </div>

      {/* Control Panel */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 shadow-soft border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Car className="h-5 w-5 text-primary" />
              Test Control Center
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={handleStartTest}
                disabled={isTestRunning}
                className="gradient-primary text-white shadow-glow hover:shadow-strong transition-smooth"
              >
                <Play className="mr-2 h-4 w-4" />
                Start New Test
              </Button>
              
              <Button
                onClick={handleStopTest}
                disabled={!isTestRunning}
                variant="destructive"
                className="shadow-soft hover:shadow-medium transition-smooth"
              >
                <Pause className="mr-2 h-4 w-4" />
                Stop Test
              </Button>
              
              <Button variant="outline" className="transition-smooth">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset Environment
              </Button>
            </div>

            {currentTest && (
              <div className="p-4 bg-muted/30 rounded-lg border border-warning">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-foreground">Currently Running: {currentTest}</p>
                  <Badge className="bg-warning text-warning-foreground animate-pulse">Live</Badge>
                </div>
                <Progress value={68} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">Episode 680 / 1000 - Average Reward: 0.847</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live Metrics */}
        <Card className="shadow-soft border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Live Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-lg font-bold text-primary">3</p>
                <p className="text-xs text-muted-foreground">Active Cars</p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-lg font-bold text-success">94.2%</p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-lg font-bold text-accent">2,842</p>
                <p className="text-xs text-muted-foreground">Episodes</p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-lg font-bold text-warning">12m</p>
                <p className="text-xs text-muted-foreground">Avg Duration</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Performance Over Time */}
        <Card className="shadow-soft border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Performance Over Episodes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
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
                <Line type="monotone" dataKey="car1" stroke="hsl(var(--primary))" strokeWidth={2} name="CAR-001" />
                <Line type="monotone" dataKey="car2" stroke="hsl(var(--accent))" strokeWidth={2} name="CAR-002" />
                <Line type="monotone" dataKey="car3" stroke="hsl(var(--success))" strokeWidth={2} name="CAR-003" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Scenario Distribution */}
        <Card className="shadow-soft border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Test Scenario Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={scenarioData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {scenarioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--popover))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px" 
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Reward Evolution */}
        <Card className="lg:col-span-2 shadow-soft border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Reward Evolution - CAR-001</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={rewardData}>
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
                <Area 
                  type="monotone" 
                  dataKey="reward" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Test Results Table */}
      <Card className="shadow-soft border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold text-foreground">Car ID</TableHead>
                <TableHead className="font-semibold text-foreground">Test ID</TableHead>
                <TableHead className="font-semibold text-foreground">Scenario</TableHead>
                <TableHead className="font-semibold text-foreground">Start Time</TableHead>
                <TableHead className="font-semibold text-foreground">Duration</TableHead>
                <TableHead className="font-semibold text-foreground">Status</TableHead>
                <TableHead className="font-semibold text-foreground">Score</TableHead>
                <TableHead className="font-semibold text-foreground">Episodes</TableHead>
                <TableHead className="font-semibold text-foreground">Avg Reward</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testResults.map((test, index) => (
                <TableRow key={index} className="hover:bg-muted/20 transition-quick">
                  <TableCell className="font-medium text-primary">{test.carId}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {test.testId}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {test.scenario}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{test.startTime}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4 text-muted-foreground" />
                      {test.duration}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(test.status)}</TableCell>
                  <TableCell>
                    {test.score > 0 ? (
                      <span className={`font-medium ${getScoreColor(test.score)}`}>
                        {test.score.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{test.episodes}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-accent" />
                      <span className="font-mono text-sm">{test.avgReward.toFixed(3)}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Testing;