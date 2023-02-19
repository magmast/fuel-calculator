import { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

export type ButtonProps = ComponentPropsWithoutRef<"button">;

const Button = ({ className, ...props }: ButtonProps) => (
  <button
    {...props}
    className={twMerge("p-2 bg-blue-900 text-white shadow rounded", className)}
  >
    Calculate
  </button>
);

export default Button;
