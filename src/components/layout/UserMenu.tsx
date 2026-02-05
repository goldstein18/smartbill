
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Settings } from "lucide-react";
import { useDemo } from "@/context/DemoContext";
import { useDemoAuth } from "@/hooks/useDemoAuth";

export const UserMenu = () => {
  const { user, profile, signOut } = useSupabaseAuth();
  const { isDemoMode } = useDemo();
  const { demoUser } = useDemoAuth();
  const navigate = useNavigate();

  // In demo mode, don't show user menu
  if (isDemoMode || demoUser) {
    return null;
  }

  if (!user) {
    return (
      <Button variant="outline" size="sm" onClick={() => navigate("/login")}>
        <User className="h-4 w-4 mr-2" />
        Sign In
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-2">
          <User className="h-4 w-4" />
          <span className="hidden md:inline">{profile?.display_name || user.email}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => navigate("/profile")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={async () => {
          await signOut();
          navigate("/");
        }}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
