"use client";
import { Breadcrumbs } from "@/src/components/Breadcrumbs";
import Button from "@/src/components/Button";
import Input from "@/src/components/input/Input";
import Nav from "@/src/components/Nav";
import { object as yupObject, string as yupString } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Select from "@/src/components/input/Select";

const schema = yupObject().shape({
  name: yupString().required("Enter"),
  username: yupString().required("Enter"),
  category: yupObject().required("Enter"),
  expiry_date: yupString().required("Enter"),
});

type SchemaProps = {
  name: string;
  username: string;
  category: {
    [key: string]: [string];
  };
  expiry_date: string;
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
              <h2>Create new list</h2>
              <form className="ls-form">
                <div className="ls-form-left">
                  <div className="ls-form-input">
                    <Input
                      {...{
                        name: "name",
                        register,
                        errors,
                        placeholder: "Title",
                      }}
                    />
                    <Input
                      {...{
                        name: "username",
                        register,
                        errors,
                        placeholder: "Description",
                      }}
                    />

                    <Select
                      {...{
                        name: "category",
                        register,
                        defaultValue: "Category",
                        defaultOption: "Category",
                        options: ["Favour wishlist"],
                        errors,
                      }}
                    />

                    <Input
                      {...{
                        name: "expiry_date",
                        register,
                        errors,
                        type: "date",
                        placeholder: "DD/MM/YY",
                      }}
                    />
                  </div>

                  <Button
                    {...{ text: "Create list" }}
                    extraClass="ls-form-btn"
                  />
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
