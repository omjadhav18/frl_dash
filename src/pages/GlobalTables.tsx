import { useState, useRef } from "react";
import { Eye, Download, Calendar, Upload } from "lucide-react";
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

const GlobalTables = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Q-Table file selected:", file.name);
      // Frontend only - backend upload logic will be added later
    }
  };
  
  // Mock data - replace with real API calls
  const globalTables = [
    {
      globalId: "GQ-2024-001",
      aggregatedDate: "2024-01-15 15:45:22",
      performanceScore: 0.947,
      clientsAggregated: 12,
      modelVersion: "v2.4.1",
    },
    {
      globalId: "GQ-2024-002",
      aggregatedDate: "2024-01-14 18:30:15",
      performanceScore: 0.923,
      clientsAggregated: 8,
      modelVersion: "v2.4.0",
    },
    {
      globalId: "GQ-2024-003",
      aggregatedDate: "2024-01-13 12:22:08",
      performanceScore: 0.915,
      clientsAggregated: 15,
      modelVersion: "v2.3.9",
    },
    {
      globalId: "GQ-2024-004",
      aggregatedDate: "2024-01-12 09:15:33",
      performanceScore: 0.901,
      clientsAggregated: 10,
      modelVersion: "v2.3.8",
    },
  ];

  const mockGlobalQTable = {
    states: ["State_0", "State_1", "State_2", "State_3", "State_4"],
    actions: ["Action_0", "Action_1", "Action_2", "Action_3"],
    values: [
      [0.89, 0.76, 0.82, 0.71],
      [0.93, 0.84, 0.78, 0.85],
      [0.87, 0.91, 0.88, 0.79],
      [0.82, 0.77, 0.94, 0.86],
      [0.76, 0.83, 0.81, 0.92],
    ],
    metadata: {
      aggregationMethod: "Weighted Average",
      totalClients: 12,
      convergenceScore: 0.94,
    }
  };

  const filteredTables = globalTables.filter((table) =>
    table.globalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.modelVersion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPerformanceColor = (score: number) => {
    if (score >= 0.9) return "text-success font-medium";
    if (score >= 0.8) return "text-warning font-medium";
    return "text-destructive font-medium";
  };

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
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json,.csv,.pkl"
            className="hidden"
          />
          <Button 
            variant="outline" 
            className="border-primary text-primary hover:bg-primary/10 transition-smooth"
            onClick={handleUploadClick}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Q-Table
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
            placeholder="Search by Global ID or Model Version..."
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
              <p className="text-2xl font-bold text-success">94.7%</p>
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
              <p className="text-2xl font-bold text-foreground">92.1%</p>
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
              <TableHead className="font-semibold text-foreground">Clients</TableHead>
              <TableHead className="font-semibold text-foreground">Model Version</TableHead>
              <TableHead className="font-semibold text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTables.map((table, index) => (
              <TableRow key={index} className="hover:bg-muted/20 transition-quick">
                <TableCell className="font-medium text-primary">{table.globalId}</TableCell>
                <TableCell className="text-sm">{table.aggregatedDate}</TableCell>
                <TableCell>
                  <span className={getPerformanceColor(table.performanceScore)}>
                    {(table.performanceScore * 100).toFixed(1)}%
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{table.clientsAggregated}</span>
                </TableCell>
                <TableCell className="font-mono text-sm">{table.modelVersion}</TableCell>
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
                            Global Q-Table: {table.globalId}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          {/* Metadata */}
                          <div className="grid gap-4 md:grid-cols-3">
                            <div className="bg-muted/30 p-3 rounded-lg">
                              <p className="text-sm font-medium text-muted-foreground">Aggregation Method</p>
                              <p className="font-semibold">{mockGlobalQTable.metadata.aggregationMethod}</p>
                            </div>
                            <div className="bg-muted/30 p-3 rounded-lg">
                              <p className="text-sm font-medium text-muted-foreground">Total Clients</p>
                              <p className="font-semibold">{mockGlobalQTable.metadata.totalClients}</p>
                            </div>
                            <div className="bg-muted/30 p-3 rounded-lg">
                              <p className="text-sm font-medium text-muted-foreground">Convergence Score</p>
                              <p className="font-semibold text-success">
                                {(mockGlobalQTable.metadata.convergenceScore * 100).toFixed(1)}%
                              </p>
                            </div>
                          </div>
                          
                          {/* Q-Table */}
                          <div className="overflow-auto">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr>
                                  <th className="border border-border p-3 bg-muted text-left text-sm font-medium">
                                    State / Action
                                  </th>
                                  {mockGlobalQTable.actions.map((action) => (
                                    <th key={action} className="border border-border p-3 bg-muted text-center text-sm font-medium">
                                      {action}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {mockGlobalQTable.states.map((state, stateIndex) => (
                                  <tr key={state}>
                                    <td className="border border-border p-3 bg-muted/30 font-medium text-sm">
                                      {state}
                                    </td>
                                    {mockGlobalQTable.values[stateIndex].map((value, actionIndex) => (
                                      <td key={actionIndex} className="border border-border p-3 text-center">
                                        <span className={`font-mono text-sm ${getPerformanceColor(value)}`}>
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

      {filteredTables.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No global Q-tables found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default GlobalTables;