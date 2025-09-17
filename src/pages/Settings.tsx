import { useState } from "react";
import { Save, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [settings, setSettings] = useState({
    minClients: "3",
    aggregationStrategy: "weighted",
    performanceMethod: "accuracy",
    autoAggregation: true,
    aggregationInterval: "60",
    notificationsEnabled: true,
    retentionDays: "30",
  });

  const { toast } = useToast();

  const handleSave = async () => {
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings Saved",
        description: "Your configuration has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setSettings({
      minClients: "3",
      aggregationStrategy: "weighted",
      performanceMethod: "accuracy",
      autoAggregation: true,
      aggregationInterval: "60",
      notificationsEnabled: true,
      retentionDays: "30",
    });
    
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Configure your federated learning system parameters
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Aggregation Settings */}
        <Card className="shadow-soft border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Aggregation Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="minClients" className="text-sm font-medium">
                Minimum Clients for Aggregation
              </Label>
              <Input
                id="minClients"
                type="number"
                value={settings.minClients}
                onChange={(e) => setSettings(prev => ({ ...prev, minClients: e.target.value }))}
                className="border-border focus:border-primary transition-smooth"
              />
              <p className="text-xs text-muted-foreground">
                Minimum number of client Q-tables required before aggregation can be performed
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="aggregationStrategy" className="text-sm font-medium">
                Aggregation Strategy
              </Label>
              <Select
                value={settings.aggregationStrategy}
                onValueChange={(value) => setSettings(prev => ({ ...prev, aggregationStrategy: value }))}
              >
                <SelectTrigger className="border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mean">Simple Mean</SelectItem>
                  <SelectItem value="weighted">Weighted Average</SelectItem>
                  <SelectItem value="median">Median</SelectItem>
                  <SelectItem value="fedavg">FedAvg Algorithm</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Method used to combine multiple client Q-tables into a global model
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="performanceMethod" className="text-sm font-medium">
                Performance Evaluation Method
              </Label>
              <Select
                value={settings.performanceMethod}
                onValueChange={(value) => setSettings(prev => ({ ...prev, performanceMethod: value }))}
              >
                <SelectTrigger className="border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="accuracy">Accuracy Score</SelectItem>
                  <SelectItem value="reward">Cumulative Reward</SelectItem>
                  <SelectItem value="convergence">Convergence Rate</SelectItem>
                  <SelectItem value="stability">Q-Value Stability</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Metric used to evaluate and compare model performance
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Automation Settings */}
        <Card className="shadow-soft border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Automation & Scheduling</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Auto-Aggregation</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically trigger aggregation when conditions are met
                </p>
              </div>
              <Switch
                checked={settings.autoAggregation}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoAggregation: checked }))}
              />
            </div>

            {settings.autoAggregation && (
              <div className="space-y-2">
                <Label htmlFor="aggregationInterval" className="text-sm font-medium">
                  Aggregation Interval (minutes)
                </Label>
                <Input
                  id="aggregationInterval"
                  type="number"
                  value={settings.aggregationInterval}
                  onChange={(e) => setSettings(prev => ({ ...prev, aggregationInterval: e.target.value }))}
                  className="border-border focus:border-primary transition-smooth"
                />
                <p className="text-xs text-muted-foreground">
                  Time interval between automatic aggregation attempts
                </p>
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Notifications</Label>
                <p className="text-xs text-muted-foreground">
                  Receive notifications for aggregation events
                </p>
              </div>
              <Switch
                checked={settings.notificationsEnabled}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, notificationsEnabled: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="shadow-soft border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="retentionDays" className="text-sm font-medium">
                Data Retention (days)
              </Label>
              <Input
                id="retentionDays"
                type="number"
                value={settings.retentionDays}
                onChange={(e) => setSettings(prev => ({ ...prev, retentionDays: e.target.value }))}
                className="border-border focus:border-primary transition-smooth"
              />
              <p className="text-xs text-muted-foreground">
                Number of days to retain client Q-tables and aggregation history
              </p>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Data Export</h4>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="transition-smooth">
                  Export Q-Tables
                </Button>
                <Button variant="outline" size="sm" className="transition-smooth">
                  Export Metrics
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card className="shadow-soft border-border">
          <CardHeader>
            <CardTitle className="text-foreground">System Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Version</p>
                <p className="font-medium">v2.4.1</p>
              </div>
              <div>
                <p className="text-muted-foreground">API Status</p>
                <p className="font-medium text-success">Online</p>
              </div>
              <div>
                <p className="text-muted-foreground">Database</p>
                <p className="font-medium text-success">Connected</p>
              </div>
              <div>
                <p className="text-muted-foreground">Uptime</p>
                <p className="font-medium">72h 34m</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">System Actions</h4>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="transition-smooth">
                  Clear Cache
                </Button>
                <Button variant="outline" size="sm" className="transition-smooth">
                  System Health Check
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button 
          variant="outline" 
          onClick={handleReset}
          className="transition-smooth"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset to Defaults
        </Button>
        
        <Button 
          onClick={handleSave}
          className="gradient-primary text-white shadow-glow hover:shadow-strong transition-smooth"
        >
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;