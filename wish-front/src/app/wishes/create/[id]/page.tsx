/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import useFetch from "@/hooks/useFetch";
import Button from "@/src/components/Button";
import FullScreenLoader from "@/src/components/Loader";
import Nav from "@/src/components/Nav";
import Input from "@/src/components/input/Input";
import Select from "@/src/components/input/Select";
import SelectInput from "@/src/components/input/SelectInput";
import UploadSvg from "@/src/components/svgs/UploadSvg";
import { List } from "@/src/types/dashboard";
import { readData } from "@/utils/storage";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { object as yupObject, string as yupString } from "yup";

const schema = yupObject().shape({
  item: yupString().required("Enter"),
  description: yupString().required("Enter"),
  wishlist: yupString().required("Enter"),
  link: yupString().required("Enter"),
  quantity: yupString().required("Enter"),
  currency: yupString().required("Enter"),
  amount: yupString().required("Enter"),
});

type SchemaProps = {
  item: string;
  description: string;
  wishlist: string;
  link: string;
  quantity: string;
  currency: string;
  amount: string;
};

interface CreateWishlist {
  item: string;
  description: string;
  link: string;
  quantity: string;
  currency: "usd" | "naira";
  amount: string;
  image?: string;
}

const CreateWish = () => {
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);

  const {
    data,
    loading: fetchingList,
    fetchData: fetchList,
  } = useFetch<List[]>({
    url: "/lists",
    method: "GET",
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const [formData, setFormData] = useState<CreateWishlist | null>(null);

  const { loading, error, fetchData } = useFetch<CreateWishlist>({
    url: `/${id}/wish`,
    method: "POST",
    body: formData,
    revalidateEndpoint: `/total-wishes`,
    shouldToastError: true,
  });

  const {
    formState: { errors },
    register,
    control,
    reset,
    handleSubmit,
  } = useForm<SchemaProps>({ resolver: yupResolver(schema) });

  const uploadImage = async (file: File) => {
    setImageLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post("/upload-wish-image", formData, {
        headers: {
          Authorization: `Bearer ${readData("saitama-token")}`,
        },
      });
      // console.log(response.data);
      return response.data.image_url;
    } catch (error) {
      toast.error("Image upload failed. Please try again.");
      return null;
    } finally {
      setImageLoading(false);
    }
  };

  const onSubmit = async (data: SchemaProps) => {
    let imageUrl: string | null = null;

    if (selectedFile) {
      imageUrl = await uploadImage(selectedFile);
    }

    // console.log(imageUrl);

    const formattedData: CreateWishlist = {
      item: data.item,
      description: data.description,
      link: data.link,
      quantity: data.quantity,
      currency: data.currency === "₦" ? "naira" : "usd",
      amount: data.amount,
      image: imageUrl ?? undefined,
    };

    setFormData(formattedData);
  };

  useEffect(() => {
    if (formData) {
      fetchData();
    }
  }, [formData]);

  useEffect(() => {
    fetchList();
  }, []);

  if (fetchingList) return <FullScreenLoader />;

  const listOptions = data ? data.map((list) => list.title) : [];

  return (
    <>
      <Nav />
      <main>
        <div className="dsb-main-cnt">
          <section>
            <div>
              <h2>Create new wish</h2>
              <form className="ls-form" onSubmit={handleSubmit(onSubmit)}>
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
                        name: "description",
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
                        options: listOptions,
                      }}
                    />

                    <Input
                      {...{
                        name: "link",
                        placeholder: "www.example.com",
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
                          // iPlaceholder: 0.0,
                          currency: true,
                        }}
                      />
                    </div>
                  </div>

                  <Button
                    {...{ text: "Add to wishlist" }}
                    type="submit"
                    loading={loading}
                    extraClass="ls-form-btn"
                  />
                </div>
                <div className="ls-form-right">
                  <UploadSvg />
                  <div>
                    {imageLoading ? (
                      <FullScreenLoader />
                    ) : previewUrl ? (
                      <div>
                        <img
                          src={previewUrl}
                          alt="Preview"
                          style={{ maxWidth: "100%", maxHeight: "200px" }}
                        />
                        <p>{selectedFile?.name}</p>
                        <button type="button" onClick={handleBrowseClick}>
                          Change
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p>
                          Drop an image here or{" "}
                          <span onClick={handleBrowseClick}>Browse</span>
                        </p>
                        <p>Supported formats: jpg, png.</p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleFileChange}
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

export default CreateWish;
