import { ReactElement } from "react";

interface ButtonProps {
    variant: "primary" | "secondary";
    text: string;
    startIcon?: ReactElement;
    onClick?: () => void;
    fullWidth?: boolean;
    loading?: boolean;
}

const variantClasses = {
    "primary": "bg-purple-600 text-white",
    "secondary": "bg-purple-200 text-purple-600"
}

const defaultClasses = "py-2 px-4 flex gap-2 rounded-md font-light justify-center items-center"

export function Button({variant, text, startIcon, onClick, fullWidth, loading}: ButtonProps) {
    return <button className={`${variantClasses[variant]} ${defaultClasses} ${fullWidth ? "w-full" : ""} ${loading ? "opacity-45" : ""}`} disabled={loading} onClick={onClick}> {startIcon} {text} </button>
}