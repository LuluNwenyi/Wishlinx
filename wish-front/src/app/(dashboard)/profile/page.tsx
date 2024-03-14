"use client";
import Button from "@/src/components/Button";
import WishlistItem from "@/src/components/WishlistItem";
import Input from "@/src/components/input/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { object as yupObject, string as yupString } from "yup";

const schema = yupObject().shape({
  name: yupString().required("Enter"),
  username: yupString().required("Enter"),
  email_address: yupString().required("Enter"),
});

type SchemaProps = {
  name: string;
  username: string;
  email_address: string;
};

const Index = () => {
  const {
    formState: { errors },
    register,
    control,
    reset,
    handleSubmit,
  } = useForm<SchemaProps>({ resolver: yupResolver(schema) });

  const isGuest = !true;
  return (
    <>
      {isGuest ? (
        <section>
          <div>
            <h2>Wish Lists</h2>
            <div className="wl-grid">
              {Array(7)
                .fill(null)
                .map((_, idx) => (
                  <WishlistItem key={idx} isCard={true} />
                ))}
            </div>
          </div>
        </section>
      ) : (
        <section>
          <div className="pfl">
            <h2>Edit your profile</h2>

            <form className="pfl-form">
              <div className="pfl-form-cnt">
                <Input
                  {...{
                    name: "name",
                    label: "Name",
                    placeholder: "Your Name",
                    labelInline: true,
                    register,
                    errors,
                  }}
                />
                <Input
                  {...{
                    name: "username",
                    label: "Username",
                    placeholder: "Select a username",
                    labelInline: true,
                    register,
                    errors,
                  }}
                />

                <Input
                  {...{
                    name: "email",
                    type: "email",
                    label: "Email Address",
                    placeholder: "Email Address",
                    labelInline: true,
                    register,
                    errors,
                  }}
                />
              </div>
              <Button {...{ text: "Save" }} extraClass="pfl-form-btn" />
            </form>
          </div>
        </section>
      )}
    </>
  );
};

export default Index;
