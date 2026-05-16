"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Archive, Share2, Sparkles, Activity } from "lucide-react";

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/analytics/overview");
        setOverview(res.data.overview);
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-6 md:p-8 space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Productivity Insights</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
      </div>
    );
  }

  const metrics = [
    { title: "Total Notes", value: overview?.totalNotes || 0, icon: FileText, color: "text-blue-500" },
    { title: "Archived Notes", value: overview?.archivedNotes || 0, icon: Archive, color: "text-amber-500" },
    { title: "Shared Notes", value: overview?.sharedNotes || 0, icon: Share2, color: "text-emerald-500" },
    { title: "AI Generations", value: overview?.aiGenerationsCount || 0, icon: Sparkles, color: "text-purple-500" },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
        <Activity className="h-6 w-6 text-indigo-500" />
        Productivity Insights
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {metric.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{metric.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Activity History</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-slate-400 border-t border-slate-100 dark:border-slate-800">
            <p>Chart data goes here...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity Log</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-slate-400 border-t border-slate-100 dark:border-slate-800">
            <p>Activity feed goes here...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
