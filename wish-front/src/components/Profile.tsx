"use client";
import { useState } from "react";
import { ProfileProps } from "../types/dashboard";
import { genericTextFormat } from "../util/dashboard";
import Modal from "./Modal";
import ShareModal from "./modals/ShareModal";
import ArrowRightSvg from "./svgs/ArrowRightSvg";

const Profile = ({ title, wishes, claims, link }: ProfileProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleShareClick = () => {
    setIsOpen(true);
  };

  return (
    <section aria-labelledby="profile">
      <div className="c-pfl">
        <div className="c-pfl-main">
          <div className="c-pfl-image"></div>
          <div>
            <h2 className="c-pfl-title">{title}</h2>
            <div className="c-pfl-dtl">
              {wishes !== undefined && (
                <p className="c-pfl-dtl-item">
                  {genericTextFormat(wishes, "wish", "wishes")}
                </p>
              )}
              <span className="c-pfl-dtl-dot"></span>
              {claims !== undefined && (
                <p className="c-pfl-dtl-item">
                  {genericTextFormat(claims, "claim", "claims")}
                </p>
              )}
            </div>
          </div>
        </div>
        <div>
          <div className="c-pfl-link" onClick={handleShareClick}>
            <span>Share your link</span>
            <ArrowRightSvg />
          </div>
        </div>
      </div>
      <Modal
        {...{ isOpen, setIsOpen, children: <ShareModal link={link || ""} /> }}
      />
    </section>
  );
};

export default Profile;
