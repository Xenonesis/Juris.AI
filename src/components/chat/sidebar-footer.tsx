'use client';

import Link from "next/link";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SidebarFooter() {
  return (
    <div className="p-4 border-t border-muted/20 bg-gradient-to-t from-muted/10 to-transparent">
      <Button
        variant="outline"
        className="w-full justify-start hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-200 rounded-xl group"
        asChild
      >
        <Link href="/profile">
          <Settings className="mr-3 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
          Settings
        </Link>
      </Button>
    </div>
  );
}
