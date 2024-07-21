import cx from "classnames";
import React, { useRef, useState } from "react";

interface InputProps {
  errors?: any;
  name: string;
  placeholder?: string;
  register: any;
  defaultValue?: string;
  label?: string;
  type?: string;
  labelInline?: boolean;
  extraClass?: string;
  inputProps?: {};
  currency?: boolean;
}

const Input: React.FC<InputProps> = ({
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
  currency = false,
}) => {
  const inputId = name;
  const [value, setValue] = useState<string>(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatCurrency = (inputValue: string): string => {
    if (inputValue) {
      const numericValue = parseFloat(inputValue.replace(/,/g, ""));
      return numericValue.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    }
    return "";
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = event.target.value;

    if (currency) {
      // Remove non-numeric characters except for the decimal point
      inputValue = inputValue.replace(/[^\d.]/g, "");

      // Format as currency if not empty
      const formattedValue = inputValue ? formatCurrency(inputValue) : "";
      setValue(formattedValue);

      // Set input value and keep cursor at the end
      if (inputRef.current) {
        const cursorPosition = inputRef.current.selectionStart;
        inputRef.current.value = formattedValue;
        inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
      }
    } else {
      // If not currency, update value directly
      setValue(inputValue);
    }
  };

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
          ref={inputRef}
          data-testid={inputId}
          {...register(name)}
          onChange={handleChange}
          value={value}
          placeholder={placeholder} // Use the provided placeholder
          {...{
            autoComplete: "off",
            autoCorrect: "off",
            autoCapitalize: "off",
            spellCheck: "false",
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
