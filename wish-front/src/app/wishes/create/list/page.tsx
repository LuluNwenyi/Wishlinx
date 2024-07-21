"use client";
import useFetch from "@/hooks/useFetch";
import Button from "@/src/components/Button";
import Nav from "@/src/components/Nav";
import Input from "@/src/components/input/Input";
import Select from "@/src/components/input/Select";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { object as yupObject, string as yupString } from "yup";

const schema = yupObject().shape({
  name: yupString().required("Enter"),
  username: yupString().required("Enter"),
  category: yupString().required("Enter"),
  expiry_date: yupString().required("Enter"),
});

type SchemaProps = {
  name: string;
  username: string;
  category: string;
  expiry_date: string;
};

const CreateList = () => {
  const router = useRouter();

  const {
    formState: { errors },
    register,
    control,
    reset,
    handleSubmit,
  } = useForm<SchemaProps>({ resolver: yupResolver(schema) });

  const { loading, fetchData } = useFetch({
    url: "/list",
    method: "POST",
    shouldToastError: true,
    revalidateEndpoint: "/lists",
  });

  const onSubmit = async (formData: SchemaProps) => {
    const requestBody = {
      title: formData.name,
      description: formData.username,
      category: formData.category,
      expiry_date: formData.expiry_date,
    };

    try {
      const response = await fetchData({ body: requestBody });
      if (response?.status !== 400) {
        router.push("/wishes");
      }
    } catch (error) {
      console.error("Error creating list:", error);
    }
  };

  return (
    <>
      <Nav />
      <main>
        <div className="dsb-main-cnt">
          <section>
            <div>
              <h2>Create new list</h2>
              <form className="ls-form" onSubmit={handleSubmit(onSubmit)}>
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
                        options: [
                          "Birthday",
                          "Anniversary",
                          "Wedding",
                          "Baby shower",
                          "Holiday",
                          "Other",
                        ],
                        errors,
                      }}
                    />

                    <Input
                      {...{
                        name: "expiry_date",
                        register,
                        errors,
                        type: "date",
                        placeholder: "Expiring date",
                      }}
                    />
                  </div>

                  <Button
                    {...{ text: "Create list" }}
                    extraClass="ls-form-btn"
                    type="submit"
                    loading={loading}
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

export default CreateList;
