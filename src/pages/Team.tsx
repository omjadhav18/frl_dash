import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Users, Plus, Share2, TrendingUp, Activity, Brain, UserPlus, Calendar, BarChart3 } from "lucide-react";

// Mock data
const teamMembers = [
  { id: 1, name: "Alice Johnson", email: "alice@company.com", role: "Lead Researcher", avatar: "", status: "online" },
  { id: 2, name: "Bob Smith", email: "bob@company.com", role: "ML Engineer", avatar: "", status: "away" },
  { id: 3, name: "Carol Davis", email: "carol@company.com", role: "Data Scientist", avatar: "", status: "online" },
  { id: 4, name: "David Wilson", email: "david@company.com", role: "Research Assistant", avatar: "", status: "offline" },
];

const sharedAnalytics = [
  { name: "Jan", performance: 0.75, accuracy: 0.82, loss: 0.23 },
  { name: "Feb", performance: 0.78, accuracy: 0.85, loss: 0.19 },
  { name: "Mar", performance: 0.82, accuracy: 0.88, loss: 0.16 },
  { name: "Apr", performance: 0.85, accuracy: 0.91, loss: 0.13 },
  { name: "May", performance: 0.89, accuracy: 0.93, loss: 0.11 },
  { name: "Jun", performance: 0.92, accuracy: 0.95, loss: 0.08 },
];

const collaborationData = [
  { name: "Experiments", value: 45, color: "hsl(var(--primary))" },
  { name: "Analysis", value: 30, color: "hsl(var(--secondary))" },
  { name: "Reviews", value: 15, color: "hsl(var(--accent))" },
  { name: "Reports", value: 10, color: "hsl(var(--muted))" },
];

const chartConfig = {
  performance: { label: "Performance", color: "hsl(var(--primary))" },
  accuracy: { label: "Accuracy", color: "hsl(var(--secondary))" },
  loss: { label: "Loss", color: "hsl(var(--destructive))" },
};

const Team = () => {
  const [selectedMetric, setSelectedMetric] = useState("performance");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Team Collaboration</h1>
          <p className="text-muted-foreground">
            Collaborate with your team on federated learning analysis
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share Dashboard
          </Button>
          <Button size="sm" className="gradient-primary text-white">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        </div>
      </div>

      {/* Team Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{teamMembers.length}</p>
                <p className="text-xs text-muted-foreground">Team Members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Activity className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">24</p>
                <p className="text-xs text-muted-foreground">Active Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <BarChart3 className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-xs text-muted-foreground">Shared Charts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Brain className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">92%</p>
                <p className="text-xs text-muted-foreground">Collaboration Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analytics">Shared Analytics</TabsTrigger>
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          {/* Chart Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Collaborative Analysis Dashboard
              </CardTitle>
              <CardDescription>
                Real-time performance metrics shared across the team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="accuracy">Accuracy</SelectItem>
                    <SelectItem value="loss">Loss</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Chart
                </Button>
              </div>

              <ChartContainer config={chartConfig} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sharedAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey={selectedMetric} 
                      stroke={chartConfig[selectedMetric as keyof typeof chartConfig]?.color}
                      strokeWidth={3}
                      dot={{ fill: chartConfig[selectedMetric as keyof typeof chartConfig]?.color, strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Collaboration Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Contribution Analysis</CardTitle>
                <CardDescription>Distribution of team activities</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={collaborationData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {collaborationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance Comparison</CardTitle>
                <CardDescription>Team vs Individual metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sharedAnalytics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="performance" fill="hsl(var(--primary))" name="Performance" />
                      <Bar dataKey="accuracy" fill="hsl(var(--secondary))" name="Accuracy" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage your collaborative team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{member.role}</Badge>
                      <Badge 
                        variant={member.status === 'online' ? 'default' : 'secondary'}
                        className={member.status === 'online' ? 'bg-green-500' : ''}
                      >
                        {member.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Team Activity</CardTitle>
              <CardDescription>Latest collaborative actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { user: "Alice Johnson", action: "shared new analysis chart", time: "2 hours ago", type: "chart" },
                  { user: "Bob Smith", action: "updated Q-table comparison", time: "4 hours ago", type: "update" },
                  { user: "Carol Davis", action: "commented on performance metrics", time: "6 hours ago", type: "comment" },
                  { user: "David Wilson", action: "created new experiment", time: "1 day ago", type: "experiment" },
                  { user: "Alice Johnson", action: "invited new team member", time: "2 days ago", type: "invite" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="p-2 rounded-lg bg-primary/10">
                      {activity.type === 'chart' && <BarChart3 className="h-4 w-4 text-primary" />}
                      {activity.type === 'update' && <Activity className="h-4 w-4 text-primary" />}
                      {activity.type === 'comment' && <Share2 className="h-4 w-4 text-primary" />}
                      {activity.type === 'experiment' && <Brain className="h-4 w-4 text-primary" />}
                      {activity.type === 'invite' && <UserPlus className="h-4 w-4 text-primary" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Team;