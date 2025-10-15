import { useState, useEffect } from "react";
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
import apiInstance from "@/utils/axiosall";

interface ClientQTable {
  id: string;
  client_email: string;
  run_id: string;
  q_table: string;
  uploaded_at: string;
}

interface GlobalQTable {
  id: string;
  q_table: Record<string, Record<string, number>>;
  aggregated_at: string;
  performance_score: number;
}

const Aggregation = () => {
  const [selectedRuns, setSelectedRuns] = useState<string[]>([]);
  const [isAggregating, setIsAggregating] = useState(false);
  const [availableRuns, setAvailableRuns] = useState<ClientQTable[]>([]);
  const [recentAggregations, setRecentAggregations] = useState<GlobalQTable[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchClientQTables();
    fetchGlobalQTables();
  }, []);

  const fetchClientQTables = async () => {
    try {
      const response = await apiInstance.get("/federated/client-qtables/");
      setAvailableRuns(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch client Q-tables.",
        variant: "destructive",
      });
    }
  };

  const fetchGlobalQTables = async () => {
    try {
      const response = await apiInstance.get("/federated/global-qtables/");
      setRecentAggregations(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch global Q-tables.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRun = (id: string) => {
    setSelectedRuns(prev => 
      prev.includes(id) 
        ? prev.filter(runId => runId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedRuns(
      selectedRuns.length === availableRuns.length 
        ? [] 
        : availableRuns.map(run => run.id)
    );
  };

  const handleAggregateAll = async () => {
    setIsAggregating(true);
    
    try {
      await apiInstance.post("/federated/aggregate/");
      
      toast({
        title: "Aggregation Completed",
        description: `Successfully aggregated Q-tables from ${availableRuns.length} clients.`,
      });
      
      setSelectedRuns([]);
      await fetchGlobalQTables();
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
      await apiInstance.post("/federated/aggregate/", { selected_ids: selectedRuns });
      
      toast({
        title: "Aggregation Completed",
        description: `Successfully aggregated Q-tables from ${selectedRuns.length} selected clients.`,
      });
      
      setSelectedRuns([]);
      await fetchGlobalQTables();
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
    return <CheckCircle className="h-4 w-4 text-success" />;
  };

  const getStatusBadge = (status: string) => {
    return <Badge className="bg-success text-success-foreground">Completed</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Clock className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
                  <Badge key={run.id} variant="outline" className="text-xs">
                    {run.client_email}
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
                <p className="text-2xl font-bold text-success">{recentAggregations.length}</p>
                <p className="text-xs text-muted-foreground">Total Aggregations</p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-foreground">
                  {recentAggregations.length > 0 
                    ? `${(recentAggregations[0].performance_score).toFixed(1)}%`
                    : "N/A"}
                </p>
                <p className="text-xs text-muted-foreground">Latest Performance</p>
              </div>
            </div>
            <div className="pt-2 border-t border-border">
              <p className="text-sm text-muted-foreground">
                {recentAggregations.length > 0 
                  ? `Last aggregation: ${formatDate(recentAggregations[0].aggregated_at)}`
                  : "No aggregations yet"}
              </p>
              <p className="text-sm text-muted-foreground">
                Available client Q-tables: {availableRuns.length}
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
                    checked={selectedRuns.length === availableRuns.length && availableRuns.length > 0}
                    onCheckedChange={handleSelectAll}
                    className="border-border"
                  />
                </TableHead>
                <TableHead className="font-semibold text-foreground">Client Email</TableHead>
                <TableHead className="font-semibold text-foreground">Run ID</TableHead>
                <TableHead className="font-semibold text-foreground">Uploaded At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {availableRuns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No client Q-tables available
                  </TableCell>
                </TableRow>
              ) : (
                availableRuns.map((run) => (
                  <TableRow key={run.id} className="hover:bg-muted/20 transition-quick">
                    <TableCell>
                      <Checkbox
                        checked={selectedRuns.includes(run.id)}
                        onCheckedChange={() => handleSelectRun(run.id)}
                        className="border-border"
                      />
                    </TableCell>
                    <TableCell className="font-medium text-primary">{run.client_email}</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {run.run_id.slice(0, 8)}...
                    </TableCell>
                    <TableCell className="text-sm">{formatDate(run.uploaded_at)}</TableCell>
                  </TableRow>
                ))
              )}
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
                <TableHead className="font-semibold text-foreground">Aggregated At</TableHead>
                <TableHead className="font-semibold text-foreground">Status</TableHead>
                <TableHead className="font-semibold text-foreground">Performance Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentAggregations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No aggregations yet
                  </TableCell>
                </TableRow>
              ) : (
                recentAggregations.map((agg) => (
                  <TableRow key={agg.id} className="hover:bg-muted/20 transition-quick">
                    <TableCell className="font-medium text-primary font-mono text-sm">
                      {agg.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell className="text-sm">{formatDate(agg.aggregated_at)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon("completed")}
                        {getStatusBadge("completed")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-success">
                        {(agg.performance_score).toFixed(1)}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Aggregation;