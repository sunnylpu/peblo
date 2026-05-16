"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FileText,
  Search,
  Settings,
  Archive,
  Share2,
  BarChart2,
  LogOut,
  Plus,
  Menu,
  Moon,
  Sun,
  Sparkles
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, setUser, isLoading, setLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
      } catch (error) {
        setUser(null);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [setUser, setLoading, router]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex items-center gap-2 text-indigo-600">
          <Sparkles className="animate-spin" />
          <span className="font-medium text-lg">Loading workspace...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const navigation = [
    { name: "All Notes", href: "/dashboard", icon: FileText },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
    { name: "Archived", href: "/dashboard/archived", icon: Archive },
    { name: "Shared", href: "/dashboard/shared", icon: Share2 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-0 -translate-x-full'} transition-all duration-300 ease-in-out border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col`}
      >
        <div className="p-4 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
            P
          </div>
          <span className="font-bold text-lg tracking-tight">Peblo</span>
        </div>

        <div className="p-4">
          <Button className="w-full justify-start gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md rounded-lg"
                  onClick={() => router.push("/dashboard/notes/new")}>
            <Plus size={18} />
            New Note
          </Button>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href}>
                <div className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                }`}>
                  <Icon size={18} />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12 px-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar || undefined} />
                  <AvatarFallback className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start truncate">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 truncate w-32">{user.email}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-950">
        {/* Top Navbar */}
        <header className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="-ml-2">
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="relative max-w-md hidden sm:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search notes, tags..."
                className="h-9 w-64 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 pl-9 pr-4 text-sm outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors"
                onClick={() => {
                  // open search dialog
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2 text-indigo-600 border-indigo-200 bg-indigo-50 hover:bg-indigo-100 dark:text-indigo-400 dark:border-indigo-900/50 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40">
              <Sparkles className="h-4 w-4" />
              AI Assistant
            </Button>
            
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
