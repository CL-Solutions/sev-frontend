"use client"

import * as React from "react"
import Link from "next/link"
import {
  Building2,
  Users,
  FileText,
  CreditCard,
  FolderOpen,
  LayoutDashboard,
  Settings,
  ChevronUp,
  User2,
  Home,
  UserPlus,
  AlertTriangle,
  Hammer,
  Receipt,
  FileBarChart,
  Briefcase,
  Shield,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Menu items for navigation
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Objekte",
    url: "/properties",
    icon: Building2,
  },
  {
    title: "Eigentümer",
    url: "/owners",
    icon: Home,
  },
  {
    title: "WEG Verwalter",
    url: "/weg-administrators",
    icon: Briefcase,
  },
  {
    title: "Handwerker",
    url: "/contractors",
    icon: Hammer,
  },
  {
    title: "Mieter",
    url: "/tenants",
    icon: Users,
  },
  {
    title: "Mieterwechsel",
    url: "/tenant-changes",
    icon: UserPlus,
  },
  {
    title: "Verträge",
    url: "/contracts",
    icon: FileText,
  },
  {
    title: "Zahlungen",
    url: "/payments",
    icon: CreditCard,
  },
  {
    title: "SEPA-Mandate",
    url: "/sepa-mandates",
    icon: Shield,
  },
  {
    title: "Rechnungszuordnung",
    url: "/invoice-matching",
    icon: Receipt,
  },
  {
    title: "Mahnwesen",
    url: "/dunning",
    icon: AlertTriangle,
  },
  {
    title: "Dokumente",
    url: "/documents",
    icon: FolderOpen,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileBarChart,
  },
  {
    title: "Einstellungen",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Building2 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">SEV Property</span>
                  <span className="truncate text-xs">Management System</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <User2 className="size-8 rounded-lg" />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Property Manager</span>
                    <span className="truncate text-xs">manager@sev.de</span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <User2 className="mr-2 size-4" />
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 size-4" />
                  Einstellungen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}