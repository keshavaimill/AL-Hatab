import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { nodes } from "@/lib/mockData";
import { Factory, Warehouse, Store, AlertTriangle } from "lucide-react";

interface NodeHealthTableProps {
  onNodeClick?: (nodeId: number) => void;
}

export const NodeHealthTable = memo(function NodeHealthTable({ onNodeClick }: NodeHealthTableProps) {
  const { t } = useTranslation();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Factory":
        return <Factory className="w-4 h-4" />;
      case "DC":
        return <Warehouse className="w-4 h-4" />;
      case "Store":
        return <Store className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      good: "bg-success/20 text-success",
      warning: "bg-warning/20 text-warning",
      danger: "bg-destructive/20 text-destructive",
    };
    return colors[status as keyof typeof colors] || "bg-muted text-muted-foreground";
  };

  const mappedNodes = useMemo(() => nodes, []);

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold">{t("pages.commandCenter.nodeHealthSummary")}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t("pages.commandCenter.node")}</th>
              <th>{t("pages.commandCenter.type")}</th>
              <th>{t("pages.commandCenter.serviceLevel")}</th>
              <th>{t("pages.commandCenter.waste")}</th>
              <th>{t("pages.commandCenter.mape")}</th>
              <th>{t("pages.commandCenter.alerts")}</th>
              <th>{t("pages.commandCenter.status")}</th>
            </tr>
          </thead>
          <tbody>
            {mappedNodes.map((node) => (
              <tr key={node.id} onClick={() => onNodeClick?.(node.id)}>
                <td className="font-medium">{node.name}</td>
                <td>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {getTypeIcon(node.type)}
                    <span>{node.type}</span>
                  </div>
                </td>
                <td>
                  <span className={node.serviceLevel >= 95 ? "text-success" : node.serviceLevel >= 90 ? "text-warning" : "text-destructive"}>
                    {node.serviceLevel}%
                  </span>
                </td>
                <td>
                  <span className={node.waste <= 2 ? "text-success" : node.waste <= 4 ? "text-warning" : "text-destructive"}>
                    {node.waste}%
                  </span>
                </td>
                <td>
                  <span className={node.mape <= 5 ? "text-success" : node.mape <= 7 ? "text-warning" : "text-destructive"}>
                    {node.mape}%
                  </span>
                </td>
                <td>
                  {node.alerts > 0 ? (
                    <div className="flex items-center gap-1 text-warning">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{node.alerts}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(node.status)}`}>
                    {t(`status.${node.status}`)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
