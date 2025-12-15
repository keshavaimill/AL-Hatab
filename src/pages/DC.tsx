import { Layout } from "@/components/layout/Layout";
import { KPICard } from "@/components/dashboard/KPICard";
import { dcKPIs, inventoryAgeData, replenishmentRecs } from "@/lib/mockData";
import { useTranslation } from "react-i18next";
import { Warehouse, TrendingUp, Clock, AlertTriangle, Package } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const DC = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <Warehouse className="w-7 h-7 text-primary" />
              {t("pages.dc.title")}
            </h1>
            <p className="text-muted-foreground">{t("pages.dc.subtitle")}</p>
          </div>
          <div className="flex items-center gap-4">
            <select className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm">
              <option>{t("pages.dc.allDCs")}</option>
              <option>{t("pages.dc.jeddahDC")}</option>
              <option>{t("pages.dc.dammamDC")}</option>
              <option>{t("pages.dc.abhaDC")}</option>
            </select>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title={t("pages.dc.dcServiceLevel")}
            value={dcKPIs.serviceLevel}
            unit="%"
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <KPICard
            title={t("pages.dc.wasteRate")}
            value={dcKPIs.wastePercent}
            unit="%"
            icon={<AlertTriangle className="w-5 h-5" />}
          />
          <KPICard
            title={t("pages.dc.avgShelfLifeRemaining")}
            value={dcKPIs.avgShelfLife}
            unit={t("pages.dc.days")}
            icon={<Clock className="w-5 h-5" />}
          />
          <KPICard
            title={t("pages.dc.backorders")}
            value={dcKPIs.backorders}
            unit={t("pages.dc.units")}
            icon={<Package className="w-5 h-5" />}
          />
        </div>

        {/* Inventory Age Pyramid */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-6">{t("pages.dc.inventoryAgeDistribution")}</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inventoryAgeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <YAxis
                  type="category"
                  dataKey="bucket"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`${value.toLocaleString()} ${t("pages.dc.units")}`, t("pages.dc.inventory")]}
                />
                <Bar dataKey="units" radius={[0, 4, 4, 0]}>
                  {inventoryAgeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Summary */}
          <div className="mt-6 pt-4 border-t border-border grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Fresh Stock (0-3 days)</p>
              <p className="text-xl font-semibold text-success">20,700 units</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">At Risk (4-5 days)</p>
              <p className="text-xl font-semibold text-warning">4,500 units</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Near Expiry (6+ days)</p>
              <p className="text-xl font-semibold text-destructive">2,250 units</p>
            </div>
          </div>
        </div>

        {/* DC × SKU Days of Cover Heatmap */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-4">Days of Cover by DC & SKU</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">DC</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium">SKU-001<br/><span className="text-xs">(Target: 4d)</span></th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium">SKU-002<br/><span className="text-xs">(Target: 4d)</span></th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium">SKU-003<br/><span className="text-xs">(Target: 5d)</span></th>
                </tr>
              </thead>
              <tbody>
                {["Jeddah DC", "Dammam DC", "Abha DC"].map((dc, dcIndex) => (
                  <tr key={dc} className="border-t border-border">
                    <td className="py-3 px-4 font-medium">{dc}</td>
                    {[
                      { cover: [5.2, 3.8, 4.5][dcIndex], target: 4 },
                      { cover: [3.1, 4.2, 3.9][dcIndex], target: 4 },
                      { cover: [6.5, 2.1, 5.8][dcIndex], target: 5 },
                    ].map((item, skuIndex) => {
                      const ratio = item.cover / item.target;
                      const bgColor = ratio < 0.7 ? "bg-destructive/30" : ratio < 0.9 ? "bg-warning/30" : ratio > 1.2 ? "bg-warning/30" : "bg-success/30";
                      const textColor = ratio < 0.7 ? "text-destructive" : ratio < 0.9 ? "text-warning" : ratio > 1.2 ? "text-warning" : "text-success";
                      return (
                        <td key={skuIndex} className="py-3 px-4 text-center">
                          <span className={`inline-block px-3 py-1 rounded-lg ${bgColor} ${textColor} font-medium`}>
                            {item.cover.toFixed(1)}d
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Replenishment Recommendations */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold">AI Replenishment Recommendations</h3>
            <p className="text-sm text-muted-foreground">Suggested dispatches to stores</p>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Store</th>
                  <th>SKU</th>
                  <th>Current On-Hand</th>
                  <th>Recommended Qty</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {replenishmentRecs.map((rec, index) => (
                  <tr key={index}>
                    <td className="font-medium">{rec.store}</td>
                    <td className="font-mono text-sm">{rec.sku}</td>
                    <td>{rec.onHand} units</td>
                    <td>
                      <span className={rec.recommended > rec.onHand ? "text-success" : "text-warning"}>
                        {rec.recommended > rec.onHand ? "+" : ""}{rec.recommended - rec.onHand} → {rec.recommended} units
                      </span>
                    </td>
                    <td className="text-muted-foreground text-sm">{rec.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DC;
