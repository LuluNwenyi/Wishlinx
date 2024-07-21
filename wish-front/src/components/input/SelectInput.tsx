import Input from "./Input";
import Select from "./Select";

const SelectInput = ({
  register,
  errors,
  sName,
  iName,
  iPlaceholder,
  options,
  defaultValue,
  currency = false,
}: {
  errors?: any;
  extraClass?: string;
  register: any;
  sName: string;
  options: string[];
  defaultValue: string;
  iName: string;
  iPlaceholder?: string;
  currency?: boolean;
}) => {
  return (
    <div className="c-input-wpr--grid">
      <Select
        {...{
          name: sName,
          register,
          defaultValue,
          extraClass: "small",
          options,
        }}
      />
      <Input
        {...{
          name: iName,
          placeholder: iPlaceholder,
          register,
          errors,
          currency,
        }}
      />
    </div>
  );
};

export default SelectInput;
