import { useState } from "react";
import { Eye, RefreshCw, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Mock data - replace with real API calls
  const clientRuns = [
    {
      clientId: "C-001",
      runId: "550e8400-e29b-41d4-a716-446655440000",
      timestamp: "2024-01-15 14:30:22",
      status: "Completed",
      performance: 0.94,
    },
    {
      clientId: "C-002",
      runId: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      timestamp: "2024-01-15 14:28:15",
      status: "Pending",
      performance: null,
    },
    {
      clientId: "C-003",
      runId: "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
      timestamp: "2024-01-15 14:25:10",
      status: "Failed",
      performance: null,
    },
    {
      clientId: "C-004",
      runId: "6ba7b812-9dad-11d1-80b4-00c04fd430c8",
      timestamp: "2024-01-15 14:22:05",
      status: "Completed",
      performance: 0.89,
    },
    {
      clientId: "C-001",
      runId: "6ba7b813-9dad-11d1-80b4-00c04fd430c8",
      timestamp: "2024-01-15 14:18:30",
      status: "Completed",
      performance: 0.91,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge variant="default" className="bg-success text-success-foreground">Completed</Badge>;
      case "Pending":
        return <Badge variant="secondary" className="bg-warning text-warning-foreground">Pending</Badge>;
      case "Failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const mockQTable = {
    states: ["State_0", "State_1", "State_2", "State_3"],
    actions: ["Action_0", "Action_1", "Action_2"],
    values: [
      [0.85, 0.23, 0.67],
      [0.91, 0.78, 0.34],
      [0.45, 0.89, 0.72],
      [0.56, 0.43, 0.91],
    ],
  };

  const filteredRuns = clientRuns.filter((run) => {
    const matchesSearch = run.clientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         run.runId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || run.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Client Runs</h1>
          <p className="text-muted-foreground">
            Monitor and analyze individual client training runs
          </p>
        </div>
        <Button className="gradient-primary text-white shadow-glow hover:shadow-strong transition-smooth">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by Client ID or Run ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-border focus:border-primary transition-smooth"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] border-border">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Data Table */}
      <div className="bg-card border border-border rounded-lg shadow-soft overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-semibold text-foreground">Client ID</TableHead>
              <TableHead className="font-semibold text-foreground">Run ID</TableHead>
              <TableHead className="font-semibold text-foreground">Timestamp</TableHead>
              <TableHead className="font-semibold text-foreground">Status</TableHead>
              <TableHead className="font-semibold text-foreground">Performance</TableHead>
              <TableHead className="font-semibold text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRuns.map((run, index) => (
              <TableRow key={index} className="hover:bg-muted/20 transition-quick">
                <TableCell className="font-medium text-primary">{run.clientId}</TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {run.runId.slice(0, 8)}...
                </TableCell>
                <TableCell className="text-sm">{run.timestamp}</TableCell>
                <TableCell>{getStatusBadge(run.status)}</TableCell>
                <TableCell>
                  {run.performance ? (
                    <span className="font-medium text-success">
                      {(run.performance * 100).toFixed(1)}%
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="hover:bg-accent hover:text-accent-foreground transition-smooth"
                        disabled={run.status !== "Completed"}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Q-Table
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl bg-popover border-border">
                      <DialogHeader>
                        <DialogTitle className="text-foreground">
                          Q-Table for {run.clientId} - {run.runId.slice(0, 8)}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="overflow-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr>
                                <th className="border border-border p-2 bg-muted text-left text-sm font-medium">
                                  State / Action
                                </th>
                                {mockQTable.actions.map((action) => (
                                  <th key={action} className="border border-border p-2 bg-muted text-center text-sm font-medium">
                                    {action}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {mockQTable.states.map((state, stateIndex) => (
                                <tr key={state}>
                                  <td className="border border-border p-2 bg-muted/30 font-medium text-sm">
                                    {state}
                                  </td>
                                  {mockQTable.values[stateIndex].map((value, actionIndex) => (
                                    <td key={actionIndex} className="border border-border p-2 text-center text-sm">
                                      <span className="font-mono">
                                        {value.toFixed(3)}
                                      </span>
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredRuns.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No client runs found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Clients;