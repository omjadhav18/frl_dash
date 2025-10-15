import { useState, useEffect } from "react";
import { Eye, Download, Calendar, RefreshCw, Activity } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import apiInstance from "@/utils/axiosall";

interface GlobalQTable {
  id: string;
  q_table: Record<string, Record<string, number>>;
  aggregated_at: string;
  performance_score: number;
}

const GlobalTables = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [globalTables, setGlobalTables] = useState<GlobalQTable[]>([]);
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  useEffect(() => {
    fetchGlobalQTables();
  }, []);

  const fetchGlobalQTables = async () => {
    setLoading(true);
    try {
      const { data } = await apiInstance.get("/federated/global-qtables/");
      setGlobalTables(data);
    } catch (error) {
      console.error("Failed to fetch global Q-Tables:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluatePerformance = async () => {
    setEvaluating(true);
    try {
      const response = await apiInstance.post("/federated/evaluate/global-qtables/");
      console.log("Evaluation response:", response.data);
      // Refresh the tables after evaluation
      await fetchGlobalQTables();
    } catch (error) {
      console.error("Failed to evaluate global Q-Tables:", error);
    } finally {
      setEvaluating(false);
    }
  };

  // Parse q_table object to structured format
  const parseQTable = (qTableObj: Record<string, Record<string, number>>) => {
    try {
      const statesSet = new Set<string>();
      const actionsSet = new Set<string>();
      
      Object.keys(qTableObj).forEach((key) => {
        const [state, action] = key.replace(/[()]/g, "").split(",").map((x) => x.trim());
        statesSet.add(state);
        actionsSet.add(action);
      });
      
      const states = Array.from(statesSet).sort((a, b) => Number(a) - Number(b));
      const actions = Array.from(actionsSet).sort((a, b) => Number(a) - Number(b));
      
      // Get all inner action keys (the nested "0", "1", etc.)
      const innerActionsSet = new Set<string>();
      Object.values(qTableObj).forEach((innerObj) => {
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
          if (qTableObj[key]) {
            innerActions.forEach((innerAction) => {
              qTableData[state][action][innerAction] = qTableObj[key][innerAction] || 0;
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

  const filteredTables = globalTables.filter((table) =>
    table.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return "text-success font-medium";
    if (score >= 80) return "text-warning font-medium";
    return "text-destructive font-medium";
  };

  // Calculate statistics
  const bestPerformance = globalTables.length > 0 
    ? Math.max(...globalTables.map(t => t.performance_score))
    : 0;
  
  const avgPerformance = globalTables.length > 0
    ? globalTables.reduce((sum, t) => sum + t.performance_score, 0) / globalTables.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Global Q-Tables</h1>
          <p className="text-muted-foreground">
            Aggregated Q-tables from federated learning processes
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="border-primary text-primary hover:bg-primary/10 transition-smooth"
            onClick={handleEvaluatePerformance}
            disabled={evaluating}
          >
            <Activity className="mr-2 h-4 w-4" />
            {evaluating ? "Evaluating..." : "Evaluate Performance"}
          </Button>
          <Button 
            variant="outline"
            className="border-border hover:bg-accent transition-smooth"
            onClick={fetchGlobalQTables}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button className="gradient-primary text-white shadow-glow hover:shadow-strong transition-smooth">
            <Download className="mr-2 h-4 w-4" />
            Export Latest
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by Global ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-border focus:border-primary transition-smooth"
          />
        </div>
      </div>

      {/* Performance Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-card border border-border rounded-lg shadow-soft p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Best Performance</p>
              <p className="text-2xl font-bold text-success">
                {bestPerformance.toFixed(1)}%
              </p>
            </div>
            <div className="p-2 rounded-lg bg-success/10">
              <Calendar className="h-4 w-4 text-success" />
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg shadow-soft p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Performance</p>
              <p className="text-2xl font-bold text-foreground">
                {avgPerformance.toFixed(1)}%
              </p>
            </div>
            <div className="p-2 rounded-lg bg-primary/10">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg shadow-soft p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Models</p>
              <p className="text-2xl font-bold text-foreground">{globalTables.length}</p>
            </div>
            <div className="p-2 rounded-lg bg-accent/10">
              <Calendar className="h-4 w-4 text-accent" />
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-card border border-border rounded-lg shadow-soft overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-semibold text-foreground">Global ID</TableHead>
              <TableHead className="font-semibold text-foreground">Aggregated Date</TableHead>
              <TableHead className="font-semibold text-foreground">Performance Score</TableHead>
              <TableHead className="font-semibold text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTables.map((table) => (
              <TableRow key={table.id} className="hover:bg-muted/20 transition-quick">
                <TableCell className="font-medium text-primary font-mono text-sm">
                  {table.id.slice(0, 8)}...
                </TableCell>
                <TableCell className="text-sm">
                  {new Date(table.aggregated_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  <span className={getPerformanceColor(table.performance_score)}>
                    {table.performance_score.toFixed(1)}%
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="hover:bg-accent hover:text-accent-foreground transition-smooth"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-5xl bg-popover border-border">
                        <DialogHeader>
                          <DialogTitle className="text-foreground">
                            Global Q-Table: {table.id.slice(0, 8)}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          {/* Metadata */}
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="bg-muted/30 p-3 rounded-lg">
                              <p className="text-sm font-medium text-muted-foreground">Aggregated At</p>
                              <p className="font-semibold">
                                {new Date(table.aggregated_at).toLocaleString()}
                              </p>
                            </div>
                            <div className="bg-muted/30 p-3 rounded-lg">
                              <p className="text-sm font-medium text-muted-foreground">Performance Score</p>
                              <p className={`font-semibold ${getPerformanceColor(table.performance_score)}`}>
                                {table.performance_score.toFixed(1)}%
                              </p>
                            </div>
                          </div>
                          
                          {/* Q-Table */}
                          {table.q_table ? (
                            (() => {
                              const parsedQ = parseQTable(table.q_table);
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
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="hover:bg-accent hover:text-accent-foreground transition-smooth"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredTables.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No global Q-tables found matching your criteria.</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      )}
    </div>
  );
};

export default GlobalTables;