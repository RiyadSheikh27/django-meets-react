import Spinner from "@/components/common/Spinner";
import { BUTTON_SIZE, BUTTON_VARIANT } from "@/constants/ui";
import { cn } from "@/utils/cn";

const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-50";

const VARIANT_CLASSES = {
  [BUTTON_VARIANT.PRIMARY]:
    "bg-brand-600 text-white enabled:hover:bg-brand-700 enabled:active:bg-brand-800",
  [BUTTON_VARIANT.SECONDARY]:
    "border border-line-strong bg-surface text-content enabled:hover:bg-surface-muted",
  [BUTTON_VARIANT.DANGER]:
    "bg-danger-600 text-white enabled:hover:bg-danger-700 enabled:active:bg-danger-700",
  [BUTTON_VARIANT.GHOST]:
    "bg-transparent text-content enabled:hover:bg-surface-muted",
};

const SIZE_CLASSES = {
  [BUTTON_SIZE.SM]: "min-h-9 px-3 text-sm",
  [BUTTON_SIZE.MD]: "min-h-11 px-4 text-sm",
  [BUTTON_SIZE.LG]: "min-h-12 px-6 text-base",
};

function Button({
  variant = BUTTON_VARIANT.PRIMARY,
  size = BUTTON_SIZE.MD,
  isLoading = false,
  disabled = false,
  type = "button",
  className,
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={cn(
        BASE_CLASSES,
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      {...rest}
    >
      {isLoading && <Spinner className="size-4" />}
      {children}
    </button>
  );
}

export default Button;
