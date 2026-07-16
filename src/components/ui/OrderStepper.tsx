import { ORDER_STATUS_LABELS, ORDER_STATUS_STEPS, OrderStatus } from "@/lib/types";
import { cn, getOrderStatusIndex } from "@/lib/utils";
import { Check } from "lucide-react";

interface OrderStepperProps {
  currentStatus: OrderStatus;
  className?: string;
}

export function OrderStepper({ currentStatus, className }: OrderStepperProps) {
  const currentIndex = getOrderStatusIndex(currentStatus);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-start justify-between relative">
        <div className="absolute top-4 left-0 right-0 h-px bg-smoke" />
        <div
          className="absolute top-4 left-0 h-px bg-ink transition-all duration-500"
          style={{
            width: `${(currentIndex / (ORDER_STATUS_STEPS.length - 1)) * 100}%`,
          }}
        />

        {ORDER_STATUS_STEPS.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div
              key={step}
              className="relative flex flex-col items-center flex-1"
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 bg-paper transition-colors duration-300",
                  isCompleted ? "border-ink bg-ink text-paper" : "border-smoke text-ash"
                )}
              >
                {isCompleted && index < currentIndex ? (
                  <Check size={14} strokeWidth={2} />
                ) : (
                  <span className="text-xs font-display">{index + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  "mt-3 text-[10px] tracking-widest uppercase text-center max-w-[80px]",
                  isCurrent ? "text-ink font-medium" : "text-ash"
                )}
              >
                {ORDER_STATUS_LABELS[step]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
