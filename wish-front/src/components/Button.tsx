import cx from "classnames";

const Button = ({
  type = "button",
  onClick,
  text,
  loading,
  loadingText,
  extraClass = "",
  foreignClass = "",
  disabled,
  icon,
  ...rest
}: {
  onClick?: (props?: any) => void;
  text: string;
  type?: "button" | "submit" | "reset";
  loadingText?: string;
  loading?: boolean;
  extraClass?: string;
  foreignClass?: string;
  disabled?: boolean;
  icon?: React.JSX.Element;
}) => {
  const className = cx("c-btn", extraClass, foreignClass, {
    loading,
  });
  return (
    <button
      type={type}
      className={className}
      {...{ onClick, disabled: disabled || loading, ...rest }}
    >
      {loading ? (
        loadingText ? (
          <span>{loadingText}</span>
        ) : (
          <span>loading...</span>
        )
      ) : (
        <>
          {icon && icon}
          <span>{text}</span>
        </>
      )}
    </button>
  );
};

export default Button;
