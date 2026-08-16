import * as React from "react";
import { cn } from "../../lib/utils";
import { Label, type LabelProps } from "./label";
export { Label, type LabelProps };

export interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

export const FormGroup = React.forwardRef<HTMLDivElement, FormGroupProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("space-y-1.5 w-full", className)}
        {...props}
      />
    );
  },
);
FormGroup.displayName = "FormGroup";

export interface FormLabelProps extends LabelProps {}

export const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, ...props }, ref) => {
    return <Label ref={ref} className={className} {...props} />;
  },
);
FormLabel.displayName = "FormLabel";

export interface FormErrorProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  message?: string;
}

export const FormError = React.forwardRef<HTMLParagraphElement, FormErrorProps>(
  ({ className, message, children, ...props }, ref) => {
    const content = message || children;
    if (!content) return null;

    return (
      <p
        ref={ref}
        className={cn("text-[11px] text-red-500 font-medium mt-1", className)}
        {...props}
      >
        {content}
      </p>
    );
  },
);
FormError.displayName = "FormError";

export interface FormHelperTextProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export const FormHelperText = React.forwardRef<
  HTMLParagraphElement,
  FormHelperTextProps
>(({ className, children, ...props }, ref) => {
  if (!children) return null;

  return (
    <p
      ref={ref}
      className={cn("text-[11px] text-slate-500 font-medium", className)}
      {...props}
    >
      {children}
    </p>
  );
});
FormHelperText.displayName = "FormHelperText";
