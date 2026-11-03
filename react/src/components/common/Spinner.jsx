import { cn } from "@/utils/cn";

function Spinner({ className, label = "Loading..." }) {
    const svg = (
        <svg
          className={cn("size-5 animate-spin", className)}
          viewBox="0 0 24 24"
          full="none"
          aria-hidden="true"
          >
            <circle 
              className="opacity-25"
              cx = "12"
              cy = "12"
              r = "10"
              stroke = "currentColor"
              strokewidth = "4"
            />
            <path 
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
    );
    if (!label) return svg;

    return (
      <span role="status" className="inline-flex">
        {svg}
        <span className="sr-only">{label}</span>
      </span>
    );
}

export default Spinner;