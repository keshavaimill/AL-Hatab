import { Layout } from "@/components/layout/Layout";
import { KPICard } from "@/components/dashboard/KPICard";
import { factoryKPIs, productionData, dispatchPlan } from "@/lib/mockData";
import { chartColors } from "@/lib/colors";
import { useTranslation } from "react-i18next";
import { Factory as FactoryIcon, Gauge, Target, AlertTriangle, DollarSign } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

const Factory = () => {
  const { t } = useTranslation();
  const [productionAdjustment, setProductionAdjustment] = useState([0]);

  const getWasteRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "text-success bg-success/20";
      case "Medium":
        return "text-warning bg-warning/20";
      case "High":
        return "text-destructive bg-destructive/20";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <FactoryIcon className="w-7 h-7 text-primary" />
              {t("pages.factory.title")}
            </h1>
            <p className="text-muted-foreground">{t("pages.factory.subtitle")}</p>
          </div>
          <div className="flex items-center gap-4">
            <select className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm">
              <option>{t("pages.factory.riyadhFactory")}</option>
              <option>{t("pages.factory.jeddahFactory")}</option>
            </select>
            <select className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm">
              <option>{t("pages.factory.allLines")}</option>
              <option>{t("pages.factory.line1")}</option>
              <option>{t("pages.factory.line2")}</option>
              <option>{t("pages.factory.line3")}</option>
            </select>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <KPICard
            title={t("pages.factory.lineUtilization")}
            value={factoryKPIs.lineUtilization}
            unit="%"
            icon={<Gauge className="w-5 h-5" />}
          />
          <KPICard
            title={t("pages.factory.productionAdherence")}
            value={factoryKPIs.productionAdherence}
            unit="%"
            icon={<Target className="w-5 h-5" />}
          />
          <KPICard
            title={t("pages.factory.defectRate")}
            value={factoryKPIs.defectRate}
            unit="%"
            icon={<AlertTriangle className="w-5 h-5" />}
          />
          <KPICard
            title={t("pages.factory.wasteUnits")}
            value={factoryKPIs.wasteUnits.toLocaleString()}
            icon={<FactoryIcon className="w-5 h-5" />}
          />
          <KPICard
            title={t("pages.factory.wasteCost")}
            value={factoryKPIs.wasteSAR.toLocaleString()}
            unit="SAR"
            icon={<DollarSign className="w-5 h-5" />}
          />
        </div>

        {/* Production Chart */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold">{t("pages.factory.hourlyProduction")}</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColors.steelBlue }} />
                <span className="text-muted-foreground">{t("pages.factory.planned")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColors.orange }} />
                <span className="text-muted-foreground">{t("pages.factory.actual")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColors.mediumGreen }} />
                <span className="text-muted-foreground">{t("pages.factory.demand")}</span>
              </div>
            </div>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="hour"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="planned" fill={chartColors.steelBlue} radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" fill={chartColors.orange} radius={[4, 4, 0, 0]} />
                <Bar dataKey="demand" fill={chartColors.mediumGreen} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dispatch Planning */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold">{t("pages.factory.dispatchPlanning")}</h3>
            <div className="text-sm text-muted-foreground">
              {t("pages.factory.todaysProductionSchedule")}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t("pages.factory.sku")}</th>
                  <th>{t("pages.factory.productName")}</th>
                  <th>{t("pages.factory.forecastedDCDemand")}</th>
                  <th>{t("pages.factory.recommendedProduction")}</th>
                  <th>{t("pages.factory.capacityImpact")}</th>
                  <th>{t("pages.factory.wasteRisk")}</th>
                </tr>
              </thead>
              <tbody>
                {dispatchPlan.map((item) => (
                  <tr key={item.sku}>
                    <td className="font-mono text-sm">{item.sku}</td>
                    <td className="font-medium">{item.name}</td>
                    <td>{item.forecastDemand.toLocaleString()}</td>
                    <td>{item.recommendedProd.toLocaleString()}</td>
                    <td>{item.capacityImpact}%</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getWasteRiskColor(item.wasteRisk)}`}>
                        {item.wasteRisk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* What-If Slider */}
        <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold mb-4">{t("pages.factory.whatIfAnalysis")}</h3>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Production Adjustment</span>
                <span className="text-sm font-medium text-primary">
                  {productionAdjustment[0] > 0 ? "+" : ""}{productionAdjustment[0]}%
                </span>
              </div>
              <Slider
                value={productionAdjustment}
                onValueChange={setProductionAdjustment}
                min={-30}
                max={30}
                step={5}
                className="w-full"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="text-center p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Projected DC Stock</p>
                <p className="text-xl font-semibold">
                  {(125000 * (1 + productionAdjustment[0] / 100)).toLocaleString()} units
                </p>
              </div>
              <div className="text-center p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Service Level Impact</p>
                <p className={`text-xl font-semibold ${productionAdjustment[0] >= 0 ? "text-success" : "text-destructive"}`}>
                  {productionAdjustment[0] >= 0 ? "+" : ""}{(productionAdjustment[0] * 0.1).toFixed(1)}%
                </p>
              </div>
              <div className="text-center p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Projected Waste Risk</p>
                <p className={`text-xl font-semibold ${productionAdjustment[0] <= 0 ? "text-success" : "text-warning"}`}>
                  {productionAdjustment[0] > 10 ? "High" : productionAdjustment[0] > 0 ? "Medium" : "Low"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Factory;
