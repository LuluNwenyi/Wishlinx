import { handleInputEnter } from "@/src/util/dashboard";
import cx from "classnames";

const Input = ({
  errors,
  name,
  placeholder,
  register,
  defaultValue = "",
  label,
  type = "text",
  inputProps = {},
  labelInline = false,
  extraClass,
}: {
  errors?: any;
  name: string;
  placeholder: string;
  register: any;
  defaultValue?: string;
  label?: string;
  type?: string;
  labelInline?: boolean;
  extraClass?: string;
  inputProps?: {};
}) => {
  const inputId = name;

  return (
    <div
      data-testid={`${name}-testid`}
      className={cx("c-input-wpr", {
        ["c-input-wpr--grid"]: label && !labelInline,
        ["c-input-wpr--inline"]: labelInline,
      })}
    >
      {label && (
        <label htmlFor={inputId} className="c-input-label">
          {label}
        </label>
      )}
      <div data-testid="input_wrapper">
        <input
          id={inputId}
          data-testid={inputId}
          {...register(name)}
          onKeyDown={handleInputEnter}
          {...{
            autoComplete: "off",
            autoCorrect: "off",
            autoCapitalize: "off",
            spellCheck: "false",
            placeholder,
            defaultValue,
            type,
            name,
            ...inputProps,
          }}
          className={cx(`c-input ${extraClass}`, {
            // [styles.show_error]: errors[name]?.message !== undefined,
            // [styles.email]: name === "email",
          })}
        />
      </div>

      <p
        data-testid={`${name}-p-testid`}
        className={cx("", {
          ["styles.show"]: !!errors && errors[name]?.message !== undefined,
        })}
      >
        {!!errors && errors[name]?.message}
      </p>
    </div>
  );
};

export default Input;
