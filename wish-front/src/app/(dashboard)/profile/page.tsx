"use client";
import useFetch from "@/hooks/useFetch";
import Button from "@/src/components/Button";
import WishlistItem from "@/src/components/WishlistItem";
import Input from "@/src/components/input/Input";
import { setCookie } from "@/utils/cookies";
import { clearData } from "@/utils/storage";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
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

const ProfilePage = () => {
  const router = useRouter();
  const { fetchData: logOutFetchData } = useFetch({
    url: "/logout",
    method: "DELETE",
  });

  const {
    data,
    loading,
    fetchData: updateUser,
  } = useFetch({
    url: "/settings/profile",
    method: "PATCH",
  });

  const {
    formState: { errors },
    register,
    control,
    reset,
    handleSubmit,
  } = useForm<SchemaProps>({ resolver: yupResolver(schema) });

  const LogOut = () => {
    logOutFetchData();
    clearData("saitama-token");
    clearData("saitameRefresh-token");
    setCookie("saitama-token", false);
    router.push("/");
  };

  const onSubmit = (formData: SchemaProps) => {
    const requestBody = {
      name: formData.name,
      username: formData.username,
      email_address: formData.email_address,
    };

    updateUser({ body: requestBody });
  };

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

            <form className="pfl-form" onSubmit={handleSubmit(onSubmit)}>
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
                    name: "email_address",
                    type: "email",
                    label: "Email Address",
                    placeholder: "Email Address",
                    labelInline: true,
                    register,
                    errors,
                  }}
                />
              </div>
              <Button
                {...{ text: "Save" }}
                type="submit"
                extraClass="pfl-form-btn"
                loading={loading}
              />
            </form>
          </div>
          <Button
            onClick={LogOut}
            {...{ text: "Logout" }}
            extraClass="pfl-form-btn"
          />
        </section>
      )}
    </>
  );
};

export default ProfilePage;
