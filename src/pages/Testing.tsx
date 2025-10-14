import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Car, MapPin, Timer, Zap, Network, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Area,
  AreaChart,
  BarChart,
  Bar,
} from "recharts";
import apiInstance from "@/utils/axios";

const Testing = () => {
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [isTrainingRunning, setIsTrainingRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [testResultsLoading, setTestResultsLoading] = useState(true);

  const showToast = (title, description, variant = "default") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, description, variant }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Fetch test results on component mount
  useEffect(() => {
    fetchTestResults();
  }, []);

  // Fetch Test Results
  const fetchTestResults = async () => {
    setTestResultsLoading(true);
    try {
      const { data } = await apiInstance.get("/federated/list/test-results/");
      setTestResults(data);
    } catch (error) {
      showToast("Error", "Failed to fetch test results", "destructive");
      console.error(error);
    } finally {
      setTestResultsLoading(false);
    }
  };

  // Generate performance data from test results
  const generatePerformanceData = () => {
    if (testResults.length === 0) {
      return [
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
    }

    return testResults.slice(0, 3).map((result, idx) => ({
      episode: result.episodes * (idx + 1),
      car1: result.success_rate + (Math.random() * 10),
      car2: result.success_rate + (Math.random() * 10),
      car3: result.success_rate + (Math.random() * 10),
    }));
  };

  const performanceData = generatePerformanceData();

  // Generate scenario distribution from test results
  const generateScenarioData = () => {
    if (testResults.length === 0) {
      return [
        { name: "Urban Navigation", value: 35, color: "#3b82f6" },
        { name: "Highway Driving", value: 28, color: "#8b5cf6" },
        { name: "Parking", value: 20, color: "#10b981" },
        { name: "Emergency", value: 17, color: "#f59e0b" },
      ];
    }

    const totalTests = testResults.length;
    const avgSuccessRate = testResults.reduce((sum, t) => sum + t.success_rate, 0) / totalTests;

    return [
      { name: "Excellent (80+%)", value: testResults.filter(t => t.success_rate >= 80).length, color: "#10b981" },
      { name: "Good (60-79%)", value: testResults.filter(t => t.success_rate >= 60 && t.success_rate < 80).length, color: "#3b82f6" },
      { name: "Needs Work (<60%)", value: testResults.filter(t => t.success_rate < 60).length, color: "#f59e0b" },
    ];
  };

  const scenarioData = generateScenarioData();

  // Transform test results for reward evolution chart
  const rewardEvolutionData = testResults.map(result => ({
    id: result.id.slice(0, 8),
    episode: result.episodes,
    reward: result.avg_reward,
    successRate: result.success_rate,
  }));

  // Calculate metrics from test results
  const calculateMetrics = () => {
    if (testResults.length === 0) {
      return {
        totalTests: 0,
        avgSuccessRate: 0,
        totalEpisodes: 0,
        avgReward: 0,
      };
    }

    const avgSuccessRate = (testResults.reduce((sum, t) => sum + t.success_rate, 0) / testResults.length).toFixed(1);
    const totalEpisodes = testResults.reduce((sum, t) => sum + t.episodes, 0);
    const avgReward = (testResults.reduce((sum, t) => sum + t.avg_reward, 0) / testResults.length).toFixed(2);

    return {
      totalTests: testResults.length,
      avgSuccessRate: parseFloat(avgSuccessRate),
      totalEpisodes,
      avgReward: parseFloat(avgReward),
    };
  };

  const metrics = calculateMetrics();

  // API Call: Start Training
  const handleStartTraining = async () => {
    setLoading(true);
    try {
      await apiInstance.post("federated/control/start_training/");
      setIsTrainingRunning(true);
      showToast("Success", "Training started successfully");
    } catch (error) {
      showToast("Error", error.message || "Failed to start training", "destructive");
    } finally {
      setLoading(false);
    }
  };

  // API Call: Stop Training
  const handleStopTraining = async () => {
    setLoading(true);
    try {
      await apiInstance.post("federated/control/stop_training/");
      setIsTrainingRunning(false);
      showToast("Success", "Training stopped successfully");
    } catch (error) {
      showToast("Error", error.message || "Failed to stop training", "destructive");
    } finally {
      setLoading(false);
    }
  };

  // API Call: Start Testing
  const handleStartTest = async () => {
    setLoading(true);
    try {
      await apiInstance.post("/federated/control/start_test/");
      setIsTestRunning(true);
      setCurrentTest("Urban Navigation - CAR-004");
      showToast("Success", "Test started successfully");
    } catch (error) {
      showToast("Error", error.message || "Failed to start test", "destructive");
    } finally {
      setLoading(false);
    }
  };

  // API Call: Global Available
  const handleGlobalAvailable = async () => {
    setLoading(true);
    try {
      await apiInstance.post("/federated/control/global_available/");
      showToast("Success", "Global availability check completed");
    } catch (error) {
      showToast("Error", error.message || "Failed to check global availability", "destructive");
    } finally {
      setLoading(false);
    }
  };

  // API Call: Aggregate Q-Tables
  const handleAggregateQTables = async () => {
    setLoading(true);
    try {
      await apiInstance.post("/federated/aggregate/");
      showToast("Success", "Q-Tables aggregated successfully");
      fetchTestResults();
    } catch (error) {
      showToast("Error", error.message || "Failed to aggregate Q-Tables", "destructive");
    } finally {
      setLoading(false);
    }
  };

  // Stop Test
  const handleStopTest = () => {
    setIsTestRunning(false);
    setCurrentTest(null);
    showToast("Stopped", "Current test has been terminated");
  };

  const getStatusBadge = (successRate) => {
    if (successRate >= 80) {
      return <Badge className="bg-green-500 text-white">Excellent</Badge>;
    } else if (successRate >= 60) {
      return <Badge className="bg-yellow-500 text-white">Good</Badge>;
    } else {
      return <Badge className="bg-orange-500 text-white">Needs Work</Badge>;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-orange-600";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {toasts.map(t => (
          <div 
            key={t.id}
            className={`p-4 rounded-lg shadow-lg text-white ${
              t.variant === 'destructive' ? 'bg-red-500' : 'bg-green-500'
            }`}
          >
            <p className="font-semibold">{t.title}</p>
            <p className="text-sm">{t.description}</p>
          </div>
        ))}
      </div>

      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Car Testing & Training Environment</h1>
        <p className="text-gray-600">
          Test and validate federated learning models in real-world driving scenarios
        </p>
      </div>

      {/* Control Panel */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Car className="h-5 w-5 text-blue-600" />
              Test & Training Control Center
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {/* Testing Controls */}
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">Testing</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    onClick={handleStartTest}
                    disabled={isTestRunning || loading}
                    className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start Testing
                  </Button>
                  
                  <Button
                    onClick={handleStopTest}
                    disabled={!isTestRunning}
                    className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    <Pause className="mr-2 h-4 w-4" />
                    Stop Test
                  </Button>
                </div>
              </div>

              {/* Training Controls */}
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">Training</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    onClick={handleStartTraining}
                    disabled={isTrainingRunning || loading}
                    className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start Training
                  </Button>
                  
                  <Button
                    onClick={handleStopTraining}
                    disabled={!isTrainingRunning || loading}
                    className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    <Pause className="mr-2 h-4 w-4" />
                    Stop Training
                  </Button>
                </div>
              </div>

              {/* Federated Operations */}
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">Federated Operations</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    onClick={handleGlobalAvailable}
                    disabled={loading}
                    className="bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50"
                  >
                    <Network className="mr-2 h-4 w-4" />
                    Global Available
                  </Button>

                  <Button
                    onClick={handleAggregateQTables}
                    disabled={loading}
                    className="bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50"
                  >
                    <Database className="mr-2 h-4 w-4" />
                    Aggregate QTable
                  </Button>
                </div>
              </div>
            </div>

            {currentTest && (
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">Currently Running: {currentTest}</p>
                  <Badge className="bg-yellow-500 text-white animate-pulse">Live</Badge>
                </div>
                <Progress value={68} className="h-2" />
                <p className="text-sm text-gray-600 mt-2">Episode 680 / 1000 - Average Reward: 0.847</p>
              </div>
            )}

            {isTrainingRunning && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">Training in Progress</p>
                  <Badge className="bg-green-500 text-white animate-pulse">Active</Badge>
                </div>
                <Progress value={45} className="h-2" />
                <p className="text-sm text-gray-600 mt-2">Federated learning model training...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live Metrics */}
        <Card className="shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Live Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-lg font-bold text-blue-600">{metrics.totalTests}</p>
                <p className="text-xs text-gray-600">Total Tests</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-lg font-bold text-green-600">{metrics.avgSuccessRate}%</p>
                <p className="text-xs text-gray-600">Avg Success Rate</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="text-lg font-bold text-purple-600">{metrics.totalEpisodes}</p>
                <p className="text-xs text-gray-600">Total Episodes</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <p className="text-lg font-bold text-orange-600">{metrics.avgReward}</p>
                <p className="text-xs text-gray-600">Avg Reward</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Performance Over Time */}
        <Card className="shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Performance Over Episodes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="episode" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#f3f4f6", 
                    border: "1px solid #d1d5db",
                    borderRadius: "8px" 
                  }} 
                />
                <Legend />
                <Line type="monotone" dataKey="car1" stroke="#3b82f6" strokeWidth={2} name="CAR-001" />
                <Line type="monotone" dataKey="car2" stroke="#8b5cf6" strokeWidth={2} name="CAR-002" />
                <Line type="monotone" dataKey="car3" stroke="#10b981" strokeWidth={2} name="CAR-003" />
              </LineChart>
            </ResponsiveContainer>
            {testResults.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs font-semibold text-blue-900">Based on {testResults.length} test results | Avg Episodes: {(testResults.reduce((sum, t) => sum + t.episodes, 0) / testResults.length).toFixed(0)}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Scenario Distribution */}
        <Card className="shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Test Scenario Distribution</CardTitle>
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
                    backgroundColor: "#f3f4f6", 
                    border: "1px solid #d1d5db",
                    borderRadius: "8px" 
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            {testResults.length > 0 && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs font-semibold text-green-900">Success Rate Distribution | Total Tests: {testResults.length}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reward Evolution - Dynamic from API data */}
        {rewardEvolutionData.length > 0 && (
          <Card className="lg:col-span-2 shadow-lg border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Average Reward by Test</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={rewardEvolutionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="id" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#f3f4f6", 
                      border: "1px solid #d1d5db",
                      borderRadius: "8px" 
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="reward" fill="#3b82f6" name="Avg Reward" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="successRate" fill="#10b981" name="Success Rate (%)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Test Results Table */}
      <Card className="shadow-lg border border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900">Recent Test Results</CardTitle>
            <Button
              onClick={fetchTestResults}
              disabled={testResultsLoading}
              className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              size="sm"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {testResultsLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading test results...</p>
            </div>
          ) : testResults.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No test results available yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="text-left px-4 py-2 font-semibold text-gray-900">Test ID</th>
                    <th className="text-left px-4 py-2 font-semibold text-gray-900">Client</th>
                    <th className="text-left px-4 py-2 font-semibold text-gray-900">Episodes</th>
                    <th className="text-left px-4 py-2 font-semibold text-gray-900">Success Rate</th>
                    <th className="text-left px-4 py-2 font-semibold text-gray-900">Avg Reward</th>
                    <th className="text-left px-4 py-2 font-semibold text-gray-900">Status</th>
                    <th className="text-left px-4 py-2 font-semibold text-gray-900">Uploaded At</th>
                  </tr>
                </thead>
                <tbody>
                  {testResults.map((test, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-2 font-mono text-xs text-blue-600">{test.id.slice(0, 8)}</td>
                      <td className="px-4 py-2 font-mono text-xs text-gray-600">{test.client.slice(0, 8)}</td>
                      <td className="px-4 py-2 font-medium">{test.episodes}</td>
                      <td className="px-4 py-2">
                        <span className={`font-medium ${getScoreColor(test.success_rate)}`}>
                          {test.success_rate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-2 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-orange-500" />
                        <span className="font-mono text-xs">{test.avg_reward.toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-2">{getStatusBadge(test.success_rate)}</td>
                      <td className="px-4 py-2 text-xs">{formatDate(test.uploaded_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Testing;