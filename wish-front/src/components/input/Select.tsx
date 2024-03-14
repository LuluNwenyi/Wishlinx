import cx from "classnames";
import ChevronDownSvg from "../svgs/ChevronDownSvg";

const Select = ({
  errors,
  name,
  register,
  defaultValue = "",
  defaultOption = "",
  label,
  options = [],
  inputProps = {},
  extraClass,
}: {
  errors?: any;
  name: string;
  register: any;
  defaultValue?: string;
  defaultOption?: string;
  label?: string;
  type?: string;
  options: string[];
  extraClass?: string;
  inputProps?: {};
}) => {
  const inputId = name;

  return (
    <div data-testid="input_wrapper" className="c-input-wpr">
      <select
        id={inputId}
        {...register(name)}
        data-testid={inputId}
        {...{
          name,
          defaultValue,
          ...inputProps,
        }}
        className={cx(`c-input ${extraClass}`, {})}
      >
        {defaultOption && (
          <option disabled value={""}>
            {defaultOption}
          </option>
        )}
        {options.map((o, idx) => (
          <option key={idx} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDownSvg />
    </div>
  );
};

export default Select;
