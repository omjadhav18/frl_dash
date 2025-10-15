import { useState, useEffect } from "react";
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
import apiInstance from "@/utils/axiosall";

interface ClientQTable {
  id: string;
  client_email: string;
  run_id: string;
  q_table: string; // stringified JSON
  uploaded_at: string;
}

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clientRuns, setClientRuns] = useState<ClientQTable[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClientQTables();
  }, []);

  const fetchClientQTables = async () => {
    setLoading(true);
    try {
      const { data } = await apiInstance.get("/federated/client-qtables/");
      setClientRuns(data);
    } catch (error) {
      console.error("Failed to fetch client Q-Tables:", error);
    } finally {
      setLoading(false);
    }
  };

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

  // Filter runs based on search
  const filteredRuns = clientRuns.filter((run) => {
    const matchesSearch =
      run.client_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      run.run_id.toLowerCase().includes(searchTerm.toLowerCase());
    // No status in response, so ignore status filter for now
    return matchesSearch;
  });

  // Parse q_table string to structured format
  const parseQTable = (qTableStr: string) => {
    try {
      const parsed = JSON.parse(qTableStr);
      // Determine unique states and actions from the outer keys
      const statesSet = new Set<string>();
      const actionsSet = new Set<string>();
      
      Object.keys(parsed).forEach((key) => {
        const [state, action] = key.replace(/[()]/g, "").split(",").map((x) => x.trim());
        statesSet.add(state);
        actionsSet.add(action);
      });
      
      const states = Array.from(statesSet).sort((a, b) => Number(a) - Number(b));
      const actions = Array.from(actionsSet).sort((a, b) => Number(a) - Number(b));
      
      // Get all inner action keys (the nested "0", "1", etc.)
      const innerActionsSet = new Set<string>();
      Object.values(parsed).forEach((innerObj: any) => {
        Object.keys(innerObj).forEach((innerKey) => innerActionsSet.add(innerKey));
      });
      const innerActions = Array.from(innerActionsSet).sort((a, b) => Number(a) - Number(b));
      
      // Build nested structure: state -> action -> innerAction -> value
      const qTableData: Record<string, Record<string, Record<string, number>>> = {};
      
      states.forEach((state) => {
        qTableData[state] = {};
        actions.forEach((action) => {
          qTableData[state][action] = {};
          const key = `(${state}, ${action})`;
          if (parsed[key]) {
            innerActions.forEach((innerAction) => {
              qTableData[state][action][innerAction] = parsed[key][innerAction] || 0;
            });
          }
        });
      });
      
      return { states, actions, innerActions, qTableData };
    } catch (error) {
      console.error("Failed to parse Q-Table:", error);
      return { states: [], actions: [], innerActions: [], qTableData: {} };
    }
  };

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
        <Button
          className="gradient-primary text-white shadow-glow hover:shadow-strong transition-smooth"
          onClick={fetchClientQTables}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by Client Email or Run ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-border focus:border-primary transition-smooth"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-card border border-border rounded-lg shadow-soft overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-semibold text-foreground">Client Email</TableHead>
              <TableHead className="font-semibold text-foreground">Run ID</TableHead>
              <TableHead className="font-semibold text-foreground">Uploaded At</TableHead>
              <TableHead className="font-semibold text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRuns.map((run) => (
              <TableRow key={run.id} className="hover:bg-muted/20 transition-quick">
                <TableCell className="font-medium text-primary">{run.client_email}</TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {run.run_id.slice(0, 8)}...
                </TableCell>
                <TableCell className="text-sm">{new Date(run.uploaded_at).toLocaleString()}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-accent hover:text-accent-foreground transition-smooth"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Q-Table
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl bg-popover border-border">
                      <DialogHeader>
                        <DialogTitle className="text-foreground">
                          Q-Table for {run.client_email} - {run.run_id.slice(0, 8)}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {run.q_table ? (
                          (() => {
                            const parsedQ = parseQTable(run.q_table);
                            return (
                              <div className="overflow-auto max-h-[500px]">
                                <table className="w-full border-collapse">
                                  <thead className="sticky top-0 bg-background z-10">
                                    <tr>
                                      <th className="border border-border p-3 bg-muted text-left text-sm font-semibold" rowSpan={2}>
                                        State
                                      </th>
                                      {parsedQ.actions.map((action) => (
                                        <th
                                          key={action}
                                          className="border border-border p-3 bg-muted text-center text-sm font-semibold"
                                          colSpan={parsedQ.innerActions.length}
                                        >
                                          Action {action}
                                        </th>
                                      ))}
                                    </tr>
                                    <tr>
                                      {parsedQ.actions.map((action) => (
                                        parsedQ.innerActions.map((innerAction) => (
                                          <th
                                            key={`${action}-${innerAction}`}
                                            className="border border-border p-2 bg-muted/70 text-center text-xs font-medium"
                                          >
                                            Q[{innerAction}]
                                          </th>
                                        ))
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {parsedQ.states.map((state) => (
                                      <tr key={state} className="hover:bg-muted/10">
                                        <td className="border border-border p-3 bg-muted/30 font-semibold text-sm">
                                          State {state}
                                        </td>
                                        {parsedQ.actions.map((action) => (
                                          parsedQ.innerActions.map((innerAction) => (
                                            <td
                                              key={`${state}-${action}-${innerAction}`}
                                              className="border border-border p-2 text-center text-sm"
                                            >
                                              <span className="font-mono text-xs">
                                                {parsedQ.qTableData[state]?.[action]?.[innerAction]?.toFixed(3) || '0.000'}
                                              </span>
                                            </td>
                                          ))
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            );
                          })()
                        ) : (
                          <p className="text-muted-foreground">No Q-Table available</p>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredRuns.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No client runs found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default Clients;