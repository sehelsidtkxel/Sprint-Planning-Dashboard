import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { forwardRef } from "react";

type CommonProps = {
  label?: string;
  className?: string;
};

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

export type UIInputProps = CommonProps &
  InputHTMLAttributes<HTMLInputElement> & {
    as?: "input";
  };

export type UITextareaProps = CommonProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    as: "textarea";
  };

const UIInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  UIInputProps | UITextareaProps
>(function UIInput(props, ref) {
  const { label, className, ...rest } = props as any;

  const shared =
    "w-full border border-slate-300 rounded px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 " +
    "focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300";

  return (
    <div>
      {label ? (
        <div className="mb-2">
          <span className="font-semibold text-sm text-slate-700">{label}</span>
        </div>
      ) : null}

      {props.as === "textarea" ? (
        <textarea
          ref={ref as any}
          className={cx(shared, className)}
          {...(rest as any)}
        />
      ) : (
        <input
          ref={ref as any}
          className={cx(shared, className)}
          {...(rest as any)}
        />
      )}
    </div>
  );
});

UIInput.displayName = "UIInput";

export default UIInput;
