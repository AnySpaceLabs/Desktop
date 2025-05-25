import React from 'react';
import AppLayout from '@/components/AppLayout';
import { DashboardCard } from '@/components/ui/dashboard-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Cpu, 
  HardDrive, 
  BarChart, 
  Activity,
  Clock, 
  MemoryStick, 
  Network, 
  Zap,
  Wifi,
  RefreshCw,
  Layers,
  Timer,
  Download,
  Upload,
  LucideIcon
} from 'lucide-react';

export default function Dashboard() {
  return (
    <AppLayout>
      <div className="flex flex-col h-full gap-6">
        {/* Header */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">System Dashboard</h1>
            <p className="text-muted-foreground mt-1">Detailed performance metrics and resource monitoring</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <RefreshCw size={14} />
              Refresh
            </Button>
            <span className="text-muted-foreground text-sm">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </header>

        {/* Top row - Key metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard 
            title="CPU" 
            value="24%" 
            description="4 cores active" 
            trend="-2%" 
            icon={Cpu} 
          />
          <MetricCard 
            title="Memory" 
            value="4.2 GB" 
            description="26% of 16 GB" 
            trend="+0.5 GB" 
            icon={MemoryStick} 
          />
          <MetricCard 
            title="Storage" 
            value="234 GB" 
            description="Free of 500 GB" 
            trend="-1.2 GB" 
            icon={HardDrive} 
          />
          <MetricCard 
            title="Network" 
            value="5.2 Mbps" 
            description="125 connections" 
            trend="+0.4 Mbps" 
            icon={Network} 
          />
        </div>

        {/* CPU Usage Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardCard 
            title="CPU Usage History" 
            description="Last 24 hours"
            icon={Activity}
          >
            <div className="h-60 flex items-center justify-center border border-dashed rounded-md">
              <div className="flex flex-col items-center text-muted-foreground">
                <Activity size={32} />
                <p className="mt-2 text-sm">CPU Usage Graph</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-4">
              <ProcessorMetric name="Core 1" usage={28} temp="42°C" />
              <ProcessorMetric name="Core 2" usage={31} temp="44°C" />
              <ProcessorMetric name="Core 3" usage={15} temp="38°C" />
              <ProcessorMetric name="Core 4" usage={22} temp="41°C" />
            </div>
          </DashboardCard>

          {/* Memory Usage */}
          <DashboardCard 
            title="Memory Allocation" 
            description="Active processes and applications"
            icon={Layers}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Total Physical Memory</p>
                  <p className="text-sm text-muted-foreground">16 GB DDR4-3200</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">4.2 GB Used (26%)</p>
                  <p className="text-sm text-muted-foreground">11.8 GB Available</p>
                </div>
              </div>
              <div className="h-2 bg-secondary w-full rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '26%' }}></div>
              </div>
              <div className="space-y-2">
                <MemoryItem name="System Processes" usage="1.2 GB" percentage={7.5} />
                <MemoryItem name="Visual Studio Code" usage="960 MB" percentage={6} />
                <MemoryItem name="Chrome Browser" usage="840 MB" percentage={5.25} />
                <MemoryItem name="Electron" usage="420 MB" percentage={2.6} />
                <MemoryItem name="Other Processes" usage="780 MB" percentage={4.9} />
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Bottom row - Storage and Network */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Storage Details */}
          <DashboardCard 
            title="Storage Overview" 
            description="Disk utilization by drive"
            icon={HardDrive}
          >
            <div className="space-y-6">
              <StorageDrive 
                name="C: (System)" 
                total="500 GB" 
                used="266 GB" 
                free="234 GB" 
                percentage={53.2} 
              />
              <StorageDrive 
                name="D: (Data)" 
                total="1 TB" 
                used="342 GB" 
                free="682 GB" 
                percentage={34.2} 
              />
              <StorageDrive 
                name="E: (Backup)" 
                total="2 TB" 
                used="1.4 TB" 
                free="600 GB" 
                percentage={70} 
              />
            </div>
          </DashboardCard>

          {/* Network Activity */}
          <DashboardCard 
            title="Network Activity" 
            description="Traffic and connectivity"
            icon={Wifi}
          >
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-secondary flex-shrink-0">
                  <Download size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Download</p>
                  <p className="text-lg font-medium">4.8 Mbps</p>
                  <p className="text-xs text-muted-foreground">380 MB total</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-secondary flex-shrink-0">
                  <Upload size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Upload</p>
                  <p className="text-lg font-medium">0.4 Mbps</p>
                  <p className="text-xs text-muted-foreground">42 MB total</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Connection</span>
                <span className="font-medium">Wi-Fi (5 GHz)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">IP Address</span>
                <span className="font-medium">192.168.1.24</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Active Connections</span>
                <span className="font-medium">125</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Latency</span>
                <span className="font-medium">12 ms</span>
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>
    </AppLayout>
  );
}

// Helper component interfaces
interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  trend: string;
  icon: LucideIcon;
}

interface ProcessorMetricProps {
  name: string;
  usage: number;
  temp: string;
}

interface MemoryItemProps {
  name: string;
  usage: string;
  percentage: number;
}

interface StorageDriveProps {
  name: string;
  total: string;
  used: string;
  free: string;
  percentage: number;
}

// Helper components
function MetricCard({ title, value, description, trend, icon: Icon }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="p-2 rounded-full bg-secondary">
            <Icon size={18} />
          </div>
        </div>
        <div className="flex items-center mt-3">
          <Zap size={14} className="mr-1" />
          <span className="text-xs font-medium">{trend} from last hour</span>
        </div>
      </CardContent>
    </Card>
  );
}

function ProcessorMetric({ name, usage, temp }: ProcessorMetricProps) {
  return (
    <div className="rounded-md border p-2 text-center">
      <p className="text-xs font-medium">{name}</p>
      <div className="flex justify-center items-center gap-1 mt-1">
        <Timer size={12} />
        <p className="text-sm font-bold">{usage}%</p>
      </div>
      <p className="text-xs text-muted-foreground mt-1">{temp}</p>
    </div>
  );
}

function MemoryItem({ name, usage, percentage }: MemoryItemProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-sm">
        <span>{name}</span>
        <span>{usage} ({percentage}%)</span>
      </div>
      <div className="h-1.5 bg-secondary w-full rounded-full overflow-hidden">
        <div className="h-full bg-primary" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}

function StorageDrive({ name, total, used, free, percentage }: StorageDriveProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-medium">{name}</span>
        <span className="text-sm text-muted-foreground">{total} total</span>
      </div>
      <div className="h-2 bg-secondary w-full rounded-full overflow-hidden">
        <div className="h-full bg-primary" style={{ width: `${percentage}%` }}></div>
      </div>
      <div className="flex justify-between text-sm">
        <span>{used} used ({percentage}%)</span>
        <span>{free} free</span>
      </div>
    </div>
  );
} 