import { ButtonHTMLAttributes, PropsWithChildren } from "react";
import "./IconButton.css";

interface IconButtonProps
  extends PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> {
  children: React.ReactNode;
  isActive?: boolean;
}

export const IconButton = ({
  children,
  className,
  isActive,
  ...props
}: IconButtonProps) => {
  return (
    <button
      className={`icon-button ${className ?? ""} ${isActive ? "icon-button--is-active" : ""}`}
      {...props}
    >
      {children}
    </button>
  );
};
