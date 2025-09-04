'use client';

import Link from "next/link";
import { Plus, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SidebarHeader() {
  return (
    <div className="flex items-center justify-between p-6 border-b border-muted/20">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25">
          <Scale className="h-5 w-5 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          Juris AI
        </h1>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-primary/10 hover:scale-105 transition-all duration-200 rounded-xl"
        asChild
      >
        <Link href="/chat">
          <Plus className="h-4 w-4" />
          <span className="sr-only">New chat</span>
        </Link>
      </Button>
    </div>
  );
}
