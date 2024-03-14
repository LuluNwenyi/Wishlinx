import cx from "classnames";

const Button = ({
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
      type="button"
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
          {icon}
          <span>{text}</span>
        </>
      )}
    </button>
  );
};

export default Button;
