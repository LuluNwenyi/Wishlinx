"use client";
import Input from "@/src/components/input/Input";
import Nav from "@/src/components/Nav";
import LovePlusSvg from "@/src/components/svgs/LovePlusSvg";
import WishItem from "@/src/components/WishItem";
import { yupResolver } from "@hookform/resolvers/yup";
import { object as yupObject, string as yupString } from "yup";
import Link from "next/link";
import { useForm } from "react-hook-form";
import Button from "@/src/components/Button";
import Modal from "@/src/components/Modal";
import { useState } from "react";
import ClaimModal from "@/src/components/modals/ClaimModal";

const schema = yupObject().shape({
  name: yupString().required("Enter"),
  email_address: yupString().required("Enter"),
});

type SchemaProps = {
  name: string;
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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      <Nav />
      <main>
        <div className="wh-s-wpr">
          <section>
            <div className="s-clm">
              <form className="s-clm-form">
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
                      name: "email",
                      placeholder: "Email Address",
                      register,
                      errors,
                    }}
                  />
                </div>
                <Button
                  {...{ text: "Claim!" }}
                  onClick={handleSubmit(() => {
                    setIsOpen((prev) => !prev);
                  })}
                  extraClass="ls-form-btn"
                />
              </form>

              <div className="s-clm-right">
                <h3 className="s-clm-dtl-hdr">Wish #245697</h3>

                <div>
                  <div className="s-clm-dtl-main">
                    <div className="s-clm-dtl-main-image"></div>
                    <div>
                      <h4 className="s-clm-dtl-main-title">Apple watch SE 2</h4>
                      <p className="s-clm-dtl-main-desc">
                        An apple watch so I can track my workouts. 🤭
                      </p>

                      <p className="s-clm-dtl-main-tag">$300</p>
                    </div>
                  </div>
                  <Link href="j/claim" className="s-clm-dtl-main-link">
                    Claim this item
                    <LovePlusSvg />
                  </Link>
                </div>
              </div>
            </div>
          </section>
          <section>
            <div className="s-clm-ls">
              <h3 className="s-clm-ls-title">More in this list</h3>
              <div className="wh-grid ">
                {Array(4)
                  .fill(null)
                  .map((_, idx) => (
                    <WishItem key={idx} />
                  ))}
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

export default Index;
