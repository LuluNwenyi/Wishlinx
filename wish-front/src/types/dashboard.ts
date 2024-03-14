import React from "react";

export type WishItemProps = {
  claimed?: boolean;
};

export type WishListItemProps = {
  isCard?: boolean;
};

export type ProfileProps = {
  title: string;
  wishes: string | number;
  claims: string | number;
};

export type ModalProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
};
