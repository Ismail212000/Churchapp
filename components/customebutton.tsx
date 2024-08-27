// // components/CustomButton.tsx
// import React from 'react';

// interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//     loading?: boolean;
//     disabled?: boolean;
//     className?: string;
// }

// const CustomButton: React.FC<CustomButtonProps> = ({
//     loading = false,
//     disabled = false,
//     className = '',
//     children,
//     ...props
// }) => {
//     return (
//         <button
//             {...props}
//             className={`btn ${className} ${loading ? 'loading' : ''}`}
//             disabled={disabled || loading}
//         >
//             {loading ? 'Loading...' : children}
//         </button>
//     );
// };

// export default CustomButton;
import React, { type ReactNode, type CSSProperties } from "react";

interface CustomButtonProps {
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
  id?: string;
  loading?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onClick,
  className,
  type = "button",
  disabled = false,
  children,
  style,
  id,
  loading = false,
}) => {
  const buttonClassName = `dui-btn text-white font-sans bg-[#280559] p-2 flex items-center rounded-lg border-0 ${className} ${
    disabled || loading ? "disabled-btn" : ""
  }`;

  return (
    <button
      type={type}
      className={buttonClassName}
      onClick={onClick}
      disabled={disabled || loading}
      style={style}
      id={id}
    >
      {loading ? <span className="circle-loader"></span> : children}
    </button>
  );
};

export default CustomButton;