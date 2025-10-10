import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function DashboardHeader() {
  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-quick" />
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-foreground">
            Federated Learning Dashboard
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your distributed Q-learning networks
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Button className="gradient-primary text-white shadow-glow hover:shadow-strong transition-smooth">
          Start Demo
        </Button>
        <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 transition-smooth">
          Start Training
        </Button>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
          <Bell className="h-4 w-4" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 px-3">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  AD
                </AvatarFallback>
              </Avatar>
              <span className="ml-2 text-sm font-medium">Admin</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-popover border-border">
            <DropdownMenuItem className="hover:bg-accent hover:text-accent-foreground transition-quick">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-accent hover:text-accent-foreground transition-quick">
              Settings
            </DropdownMenuItem>
          <DropdownMenuItem 
              className="hover:bg-destructive hover:text-destructive-foreground transition-quick"
              onClick={() => window.location.href = '/login'}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}