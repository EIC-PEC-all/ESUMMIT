import * as React from "react"
import { cn } from "@/lib/utils"

export type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"

export type ButtonSize = "default" | "sm" | "lg" | "icon"

export interface ButtonVariantProps {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

const variantStyles: Record<ButtonVariant, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
}

const sizeStyles: Record<ButtonSize, string> = {
  default: "h-10 px-5 py-2 rounded-full",
  sm: "h-9 rounded-full px-4",
  lg: "h-11 rounded-full px-8",
  icon: "h-10 w-10 rounded-full",
}

export function buttonVariants({
  variant = "default",
  size = "default",
  className = "",
}: ButtonVariantProps = {}) {
  const base =
    "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
  return cn(base, variantStyles[variant], sizeStyles[size], className)
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariantProps {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, children, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<{ className?: string }>, {
        className: cn(buttonVariants({ variant, size, className }), (children.props as { className?: string }).className),
        ...props,
      })
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  },
)
Button.displayName = "Button"

export { Button }
