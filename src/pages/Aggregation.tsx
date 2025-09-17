import { useState } from "react";
import { GitMerge, Play, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

const Aggregation = () => {
  const [selectedRuns, setSelectedRuns] = useState<string[]>([]);
  const [isAggregating, setIsAggregating] = useState(false);
  const { toast } = useToast();

  // Mock data - replace with real API calls
  const availableRuns = [
    {
      clientId: "C-001",
      runId: "550e8400-e29b-41d4-a716-446655440000",
      timestamp: "2024-01-15 14:30:22",
      performance: 0.94,
      status: "ready",
    },
    {
      clientId: "C-002",
      runId: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      timestamp: "2024-01-15 14:28:15",
      performance: 0.89,
      status: "ready",
    },
    {
      clientId: "C-004",
      runId: "6ba7b812-9dad-11d1-80b4-00c04fd430c8",
      timestamp: "2024-01-15 14:22:05",
      performance: 0.91,
      status: "ready",
    },
    {
      clientId: "C-005",
      runId: "6ba7b814-9dad-11d1-80b4-00c04fd430c8",
      timestamp: "2024-01-15 14:18:30",
      performance: 0.87,
      status: "ready",
    },
  ];

  const recentAggregations = [
    {
      id: "AGG-001",
      timestamp: "2024-01-15 15:45:22",
      status: "completed",
      clientsIncluded: 12,
      finalScore: 0.947,
    },
    {
      id: "AGG-002",
      timestamp: "2024-01-15 12:30:15",
      status: "completed",
      clientsIncluded: 8,
      finalScore: 0.923,
    },
    {
      id: "AGG-003",
      timestamp: "2024-01-15 09:15:08",
      status: "failed",
      clientsIncluded: 5,
      finalScore: null,
    },
  ];

  const handleSelectRun = (runId: string) => {
    setSelectedRuns(prev => 
      prev.includes(runId) 
        ? prev.filter(id => id !== runId)
        : [...prev, runId]
    );
  };

  const handleSelectAll = () => {
    setSelectedRuns(
      selectedRuns.length === availableRuns.length 
        ? [] 
        : availableRuns.map(run => run.runId)
    );
  };

  const handleAggregateAll = async () => {
    setIsAggregating(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Aggregation Completed",
        description: `Successfully aggregated Q-tables from ${availableRuns.length} clients.`,
      });
      
      setSelectedRuns([]);
    } catch (error) {
      toast({
        title: "Aggregation Failed",
        description: "An error occurred during the aggregation process.",
        variant: "destructive",
      });
    } finally {
      setIsAggregating(false);
    }
  };

  const handleAggregateSelected = async () => {
    if (selectedRuns.length === 0) {
      toast({
        title: "No Runs Selected",
        description: "Please select at least one client run to aggregate.",
        variant: "destructive",
      });
      return;
    }

    setIsAggregating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Aggregation Completed",
        description: `Successfully aggregated Q-tables from ${selectedRuns.length} selected clients.`,
      });
      
      setSelectedRuns([]);
    } catch (error) {
      toast({
        title: "Aggregation Failed",
        description: "An error occurred during the aggregation process.",
        variant: "destructive",
      });
    } finally {
      setIsAggregating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "running":
        return <Clock className="h-4 w-4 text-warning animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success text-success-foreground">Completed</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "running":
        return <Badge className="bg-warning text-warning-foreground">Running</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Aggregation Control</h1>
        <p className="text-muted-foreground">
          Manage and trigger federated Q-table aggregation processes
        </p>
      </div>

      {/* Control Panel */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <Card className="shadow-soft border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <GitMerge className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleAggregateAll}
              disabled={isAggregating}
              className="w-full gradient-primary text-white shadow-glow hover:shadow-strong transition-smooth"
            >
              {isAggregating ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Aggregating...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Aggregate All Client Q-Tables
                </>
              )}
            </Button>
            
            <div className="pt-2 border-t border-border">
              <p className="text-sm text-muted-foreground mb-2">
                {availableRuns.length} client runs available for aggregation
              </p>
              <div className="flex flex-wrap gap-2">
                {availableRuns.slice(0, 4).map((run) => (
                  <Badge key={run.runId} variant="outline" className="text-xs">
                    {run.clientId}
                  </Badge>
                ))}
                {availableRuns.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{availableRuns.length - 4} more
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Aggregation Stats */}
        <Card className="shadow-soft border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Aggregation Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-success">12</p>
                <p className="text-xs text-muted-foreground">Completed Today</p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-foreground">94.7%</p>
                <p className="text-xs text-muted-foreground">Best Performance</p>
              </div>
            </div>
            <div className="pt-2 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Last aggregation: 2 hours ago
              </p>
              <p className="text-sm text-muted-foreground">
                Average aggregation time: 3.2 minutes
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Runs for Selection */}
      <Card className="shadow-soft border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">Select Client Runs</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="transition-smooth"
              >
                {selectedRuns.length === availableRuns.length ? "Deselect All" : "Select All"}
              </Button>
              <Button
                onClick={handleAggregateSelected}
                disabled={isAggregating || selectedRuns.length === 0}
                className="gradient-accent text-white transition-smooth"
                size="sm"
              >
                <GitMerge className="mr-2 h-4 w-4" />
                Aggregate Selected ({selectedRuns.length})
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedRuns.length === availableRuns.length}
                    onCheckedChange={handleSelectAll}
                    className="border-border"
                  />
                </TableHead>
                <TableHead className="font-semibold text-foreground">Client ID</TableHead>
                <TableHead className="font-semibold text-foreground">Run ID</TableHead>
                <TableHead className="font-semibold text-foreground">Timestamp</TableHead>
                <TableHead className="font-semibold text-foreground">Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {availableRuns.map((run) => (
                <TableRow key={run.runId} className="hover:bg-muted/20 transition-quick">
                  <TableCell>
                    <Checkbox
                      checked={selectedRuns.includes(run.runId)}
                      onCheckedChange={() => handleSelectRun(run.runId)}
                      className="border-border"
                    />
                  </TableCell>
                  <TableCell className="font-medium text-primary">{run.clientId}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {run.runId.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="text-sm">{run.timestamp}</TableCell>
                  <TableCell>
                    <span className="font-medium text-success">
                      {(run.performance * 100).toFixed(1)}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Aggregations */}
      <Card className="shadow-soft border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Aggregations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold text-foreground">Aggregation ID</TableHead>
                <TableHead className="font-semibold text-foreground">Timestamp</TableHead>
                <TableHead className="font-semibold text-foreground">Status</TableHead>
                <TableHead className="font-semibold text-foreground">Clients</TableHead>
                <TableHead className="font-semibold text-foreground">Final Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentAggregations.map((agg) => (
                <TableRow key={agg.id} className="hover:bg-muted/20 transition-quick">
                  <TableCell className="font-medium text-primary">{agg.id}</TableCell>
                  <TableCell className="text-sm">{agg.timestamp}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(agg.status)}
                      {getStatusBadge(agg.status)}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{agg.clientsIncluded}</TableCell>
                  <TableCell>
                    {agg.finalScore ? (
                      <span className="font-medium text-success">
                        {(agg.finalScore * 100).toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
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

export default Aggregation;