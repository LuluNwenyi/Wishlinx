"use client";
import Button from "@/src/components/Button";
import Nav from "@/src/components/Nav";
import { yupResolver } from "@hookform/resolvers/yup";
import { object as yupObject, string as yupString } from "yup";
import { useForm } from "react-hook-form";
import Input from "@/src/components/input/Input";
import Select from "@/src/components/input/Select";
import SelectInput from "@/src/components/input/SelectInput";
import UploadSvg from "@/src/components/svgs/UploadSvg";

const schema = yupObject().shape({
  item: yupString().required("Enter"),
  description: yupString().required("Enter"),
  wishlist: yupObject().required("Enter"),
  link: yupString().required("Enter"),
  quantity: yupString().required("Enter"),
  currency: yupString().required("Enter"),
  amount: yupString().required("Enter"),
});

type SchemaProps = {
  item: string;
  description: string;
  wishlist: {
    [key: string]: [string];
  };
  link: string;
  quantity: string;
  currency: string;
  amount: string;
};

const Index = () => {
  const {
    formState: { errors },
    register,
    control,
    reset,
    handleSubmit,
  } = useForm<SchemaProps>({ resolver: yupResolver(schema) });
  return (
    <>
      <Nav />
      <main>
        <div className="dsb-main-cnt">
          <section>
            <div>
              <h2>Edit wish</h2>
              <form className="ls-form">
                <div>
                  <div className="ls-form-input">
                    <Input
                      {...{
                        name: "item",
                        placeholder: "Item",
                        register,
                        errors,
                      }}
                    />

                    <Input
                      {...{
                        name: "desc",
                        placeholder: "Description",
                        register,
                        errors,
                      }}
                    />

                    <Select
                      {...{
                        name: "wishlist",
                        register,
                        defaultValue: "",
                        defaultOption: "Select List",
                        options: ["Favour wishlist"],
                      }}
                    />

                    <Input
                      {...{
                        name: "link",
                        placeholder:
                          "https://tekkasstore.com/products/apple-watch-series-7",
                        label: "Link",
                        register,
                        errors,
                      }}
                    />

                    <div className="half_inputs">
                      <Input
                        {...{
                          label: "Qty",
                          name: "quantity",
                          placeholder: "1",
                          register,
                          errors,
                        }}
                      />
                      <SelectInput
                        {...{
                          register,
                          errors,
                          sName: "currency",
                          iName: "amount",
                          options: ["₦", "$"],
                          defaultValue: "₦",
                          iPlaceholder: "0.00",
                        }}
                      />
                    </div>
                  </div>

                  <Button
                    {...{ text: "Add to wishlist", onClick: handleSubmit }}
                    extraClass="ls-form-btn"
                  />
                </div>
                <div className="ls-form-right">
                  <UploadSvg />
                  <div>
                    <p>
                      Drop an image here or <span>Browse</span>
                    </p>
                    <p>Supported formats: jpg, png.</p>
                  </div>
                </div>
              </form>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default Index;
