import { Layout } from "@/components/layout/Layout";
import { KPICard } from "@/components/dashboard/KPICard";
import { SaudiMap } from "@/components/dashboard/SaudiMap";
import { NodeHealthTable } from "@/components/dashboard/NodeHealthTable";
import { FunnelChart } from "@/components/dashboard/FunnelChart";
import { DemandForecastChart } from "@/components/dashboard/DemandForecastChart";
import { HeatmapChart } from "@/components/dashboard/HeatmapChart";
import { kpiData } from "@/lib/mockData";
import { useTranslation } from "react-i18next";
import { Target, DollarSign, TrendingUp, Package, Sparkles, BarChart3 } from "lucide-react";
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

const Index = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t("pages.commandCenter.title")}</h1>
            <p className="text-muted-foreground">{t("pages.commandCenter.subtitle")}</p>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KPICard
            title={t("pages.commandCenter.forecastAccuracy")}
            value={kpiData.forecastAccuracy.value}
            unit="%"
            trend={kpiData.forecastAccuracy.trend}
            trendLabel={t("pages.commandCenter.vsLastWeek")}
            sparklineData={kpiData.forecastAccuracy.sparkline}
            icon={<Target className="w-5 h-5" />}
          />
          <KPICard
            title={t("pages.commandCenter.wasteCost")}
            value={formatCurrency(kpiData.wasteCost.value)}
            unit="SAR"
            trend={kpiData.wasteCost.trend}
            trendLabel={`${kpiData.wasteCost.percentOfRevenue}% ${t("pages.commandCenter.ofRevenue")}`}
            sparklineData={kpiData.wasteCost.sparkline}
            icon={<DollarSign className="w-5 h-5" />}
          />
          <KPICard
            title={t("pages.commandCenter.serviceLevel")}
            value={kpiData.serviceLevel.value}
            unit="%"
            trend={kpiData.serviceLevel.trend}
            trendLabel={t("pages.commandCenter.dcAndStore")}
            sparklineData={kpiData.serviceLevel.sparkline}
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <KPICard
            title={t("pages.commandCenter.onShelfAvailability")}
            value={kpiData.onShelfAvailability.value}
            unit="%"
            trend={kpiData.onShelfAvailability.trend}
            trendLabel={t("common.retail")}
            sparklineData={kpiData.onShelfAvailability.sparkline}
            icon={<Package className="w-5 h-5" />}
          />
          <KPICard
            title={t("pages.commandCenter.netMargin")}
            value={formatCurrency(kpiData.netMargin.value)}
            unit="SAR"
            trend={kpiData.netMargin.trend}
            trendLabel={t("pages.commandCenter.afterWaste")}
            sparklineData={kpiData.netMargin.sparkline}
            icon={<BarChart3 className="w-5 h-5" />}
          />
          <KPICard
            title={t("pages.commandCenter.aiUplift")}
            value={formatCurrency(kpiData.aiUplift.value)}
            unit="SAR"
            trend={kpiData.aiUplift.trend}
            trendLabel={t("pages.commandCenter.vsManual")}
            sparklineData={kpiData.aiUplift.sparkline}
            icon={<Sparkles className="w-5 h-5" />}
          />
        </div>

        {/* Map & Node Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold mb-4">{t("pages.commandCenter.saudiArabiaNetwork")}</h3>
            <SaudiMap />
          </div>
          <NodeHealthTable />
        </div>

        {/* Funnel Chart */}
        <FunnelChart />

        {/* Time Series Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DemandForecastChart />
          <HeatmapChart />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
