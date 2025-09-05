'use client';

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JurisLogo } from "../juris-logo";

export function SidebarHeader() {
  return (
    <div className="flex items-center justify-between p-6 border-b border-muted/20">
      <JurisLogo />
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
