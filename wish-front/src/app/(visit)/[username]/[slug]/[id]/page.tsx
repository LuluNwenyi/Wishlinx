/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import useFetch from "@/hooks/useFetch";
import Button from "@/src/components/Button";
import Modal from "@/src/components/Modal";
import WishItem from "@/src/components/WishItem";
import Input from "@/src/components/input/Input";
import ClaimModal from "@/src/components/modals/ClaimModal";
import formatCurrency from "@/src/helpers/formatCurrency";
import { Wishes } from "@/src/types/dashboard";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { object as yupObject, string as yupString } from "yup";

const schema = yupObject().shape({
  name: yupString().required("Enter"),
  email_address: yupString().required("Enter"),
});

type SchemaProps = {
  name: string;
  email_address: string;
};

interface FetchDataProps {
  name: string;
  email: string;
}

const ClaimItem = () => {
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<SchemaProps>({ resolver: yupResolver(schema) });
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { username, slug, id } = useParams();

  const url = `${slug}/wish/${id}`;
  const {
    data,
    loading,
    fetchData: fetchWish,
  } = useFetch<Wishes>({
    url: url,
    method: "GET",
  });

  const { loading: claiming, fetchData } = useFetch<FetchDataProps>({
    url: `/${id}/claim`,
    method: "POST",
    shouldToastError: true,
    revalidateEndpoint: "/claims",
  });

  const {
    data: wishes,
    loading: fetchingWishes,
    fetchData: fetchWishes,
  } = useFetch<Wishes[]>({
    url: `/${slug}/wish`,
    method: "GET",
  });

  const onSubmit = async (data: SchemaProps) => {
    const response = await fetchData({
      body: {
        name: data.name,
        email: data.email_address,
      },
    });

    if (response && !response.error) {
      setIsOpen(true);
    }
  };

  useEffect(() => {
    fetchWishes();
    fetchWish();
  }, []);

  if (loading || fetchingWishes) {
    return <p>Fetching wish</p>;
  }

  return (
    <>
      <main>
        <div className="wh-s-wpr">
          <section>
            <div className="s-clm">
              <form className="s-clm-form" onSubmit={handleSubmit(onSubmit)}>
                <h2 className="s-clm-form-title">Claim this item</h2>
                <div className="s-clm-form-input">
                  <Input
                    {...{
                      name: "name",
                      placeholder: "Your name",
                      register,
                      errors,
                    }}
                  />

                  <Input
                    {...{
                      name: "email_address",
                      placeholder: "Email Address",
                      register,
                      errors,
                    }}
                  />
                </div>
                <Button
                  {...{ text: "Claim!", type: "submit" }}
                  loading={claiming}
                  extraClass="ls-form-btn"
                />
              </form>

              <div className="s-clm-right">
                <h3 className="s-clm-dtl-hdr">Wish #{data?.id}</h3>

                <div>
                  <div className="s-clm-dtl-main">
                    <div className="s-clm-dtl-main-image"></div>
                    <div>
                      <h4 className="s-clm-dtl-main-title">{data?.item}</h4>
                      <p className="s-clm-dtl-main-desc">
                        {data?.description}🤭
                      </p>
                      {data && (
                        <p className="s-clm-dtl-main-tag">
                          {formatCurrency(data.currency, data.amount)}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* <Link href="j/claim" className="s-clm-dtl-main-link">
                    Claim this item
                    <LovePlusSvg />
                  </Link> */}
                </div>
              </div>
            </div>
          </section>
          <section>
            <div className="s-clm-ls">
              <h3 className="s-clm-ls-title">More in this list</h3>
              <div className="wh-grid ">
                {wishes && wishes?.length < 1 ? (
                  <p>No wishes for this list.</p>
                ) : (
                  <>
                    {wishes?.map((wish) => (
                      <WishItem
                        key={wish.id}
                        name={wish?.item}
                        currency={wish?.currency}
                        id={`/${username}/${slug}/${wish?.id}`}
                        price={wish?.amount}
                      />
                    ))}
                  </>
                )}
              </div>
            </div>
          </section>

          {isOpen && (
            <Modal {...{ isOpen, setIsOpen, children: <ClaimModal /> }} />
          )}
        </div>
      </main>
    </>
  );
};

export default ClaimItem;
