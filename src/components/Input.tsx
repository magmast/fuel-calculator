import { ComponentPropsWithoutRef, ForwardedRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export interface InputProps extends ComponentPropsWithoutRef<"input"> {
  suffix?: string;
  error?: string;
}

const Input = forwardRef(function Input(
  { className, suffix, error, ...props }: InputProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  return (
    <div>
      <div className="relative">
        <input
          ref={ref}
          {...props}
          className={twMerge(
            "border p-2 placeholder:text-gray-500 w-full rounded",
            error
              ? "bg-red-200 border-red-700 placeholder:text-red-700 text-red-700"
              : "border-gray-200 placeholder:text-gray-500 text-gray-500",
            className
          )}
        />

        {suffix && (
          <p className="absolute text-gray-500 right-2 top-1/2 -translate-y-1/2">
            {suffix}
          </p>
        )}
      </div>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
});

export default Input;
