import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'danger' | 'warning' | 'success' | 'info';
}

const variantStyles = {
  default: "border-border",
  danger: "border-danger/50 bg-danger/5",
  warning: "border-warning/50 bg-warning/5",
  success: "border-success/50 bg-success/5",
  info: "border-info/50 bg-info/5"
};

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus
};

const trendColors = {
  up: "text-success",
  down: "text-danger",
  neutral: "text-muted-foreground"
};

export const KPICard = ({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon,
  className,
  variant = 'default'
}: KPICardProps) => {
  const TrendIcon = trend ? trendIcons[trend] : null;
  
  return (
    <Card className={cn(
      "p-6 backdrop-blur-sm bg-card/80 border transition-all duration-200 hover:bg-card/90",
      variantStyles[variant],
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-card-foreground">{value}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="text-muted-foreground">
            {icon}
          </div>
        )}
      </div>
      
      {trend && trendValue && TrendIcon && (
        <div className="flex items-center mt-4 space-x-2">
          <TrendIcon className={cn("h-4 w-4", trendColors[trend])} />
          <span className={cn("text-sm font-medium", trendColors[trend])}>
            {trendValue}
          </span>
          <span className="text-sm text-muted-foreground">vs período anterior</span>
        </div>
      )}
    </Card>
  );
};