import { useState, useEffect } from "react";
import { PlayCircle, StopCircle, Clock, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import apiInstance from "@/utils/axiosall";

interface FederatedRun {
  id: string;
  started_at: string;
  ended_at: string | null;
  is_active: boolean;
}

interface EventData {
  episode: number;
  progress: number;
}

interface ClientEvent {
  id: string;
  run: string;
  car: string;
  event_type: string;
  data: EventData;
  timestamp: string;
}

const Observe = () => {
  const [federatedRuns, setFederatedRuns] = useState<FederatedRun[]>([]);
  const [events, setEvents] = useState<ClientEvent[]>([]);
  const [loadingRuns, setLoadingRuns] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);

  useEffect(() => {
    fetchFederatedRuns();
    fetchEvents();
  }, []);

  const fetchFederatedRuns = async () => {
    setLoadingRuns(true);
    try {
      const { data } = await apiInstance.get("/federated/runs/");
      setFederatedRuns(data);
    } catch (error) {
      console.error("Failed to fetch federated runs:", error);
    } finally {
      setLoadingRuns(false);
    }
  };

  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const { data } = await apiInstance.get("/federated/events/");
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoadingEvents(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatShortId = (id: string) => {
    return id.slice(0, 8);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Observe</h1>
        <p className="text-muted-foreground">
          Monitor federated runs and training events in real-time
        </p>
      </div>

      {/* Federated Runs Section */}
      <Card className="border-border shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="h-5 w-5 text-primary" />
            Federated Runs History
          </CardTitle>
          <CardDescription>Track all federated learning runs</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingRuns ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading runs...</p>
            </div>
          ) : federatedRuns.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No federated runs found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Run ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Started At</TableHead>
                  <TableHead>Ended At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {federatedRuns.map((run) => (
                  <TableRow key={run.id}>
                    <TableCell className="font-mono text-sm">
                      {formatShortId(run.id)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={run.is_active ? "default" : "secondary"}
                        className={
                          run.is_active
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {run.is_active ? "Active" : "Completed"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDate(run.started_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {run.ended_at ? (
                        <div className="flex items-center gap-2">
                          <StopCircle className="h-4 w-4 text-muted-foreground" />
                          {formatDate(run.ended_at)}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Running...</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Events Section */}
      <Card className="border-border shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Training Events
          </CardTitle>
          <CardDescription>Real-time progress updates from training sessions</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingEvents ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No training events found</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event ID</TableHead>
                    <TableHead>Run ID</TableHead>
                    <TableHead>Car ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Episode</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-mono text-sm">
                        {formatShortId(event.id)}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {formatShortId(event.run)}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {formatShortId(event.car)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{event.event_type}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {event.data.episode}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-smooth"
                              style={{ width: `${event.data.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium min-w-[3rem]">
                            {event.data.progress}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(event.timestamp)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Observe;