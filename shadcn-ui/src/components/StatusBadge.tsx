import { Badge } from '@/components/ui/badge';
import { Job } from '@/types/job';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface StatusBadgeProps {
  status: Job['status'];
  reason?: string | null;
}

export default function StatusBadge({ status, reason }: StatusBadgeProps) {
  const getStatusConfig = (status: Job['status']) => {
    switch (status) {
      case 'green':
        return {
          icon: CheckCircle,
          text: 'Completed',
          className: 'bg-green-100 text-green-800 border-green-200',
        };
      case 'amber':
        return {
          icon: Clock,
          text: 'In Progress',
          className: 'bg-amber-100 text-amber-800 border-amber-200',
        };
      case 'red':
        return {
          icon: AlertTriangle,
          text: 'Issue',
          className: 'bg-red-100 text-red-800 border-red-200',
        };
      default:
        return {
          icon: Clock,
          text: 'Unknown',
          className: 'bg-gray-100 text-gray-800 border-gray-200',
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div className="flex flex-col gap-1">
      <Badge className={`${config.className} flex items-center gap-1 w-fit`}>
        <Icon size={12} />
        {config.text}
      </Badge>
      {reason && (
        <span className="text-xs text-muted-foreground">{reason}</span>
      )}
    </div>
  );
}