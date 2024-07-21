import React from "react";

export interface User {
  email: string;
  id: string;
  name: string;
  public_id: string;
  username: string;
}

export interface ClaimsResponse {
  claims: {
    created_at: string;
    email: string;
    id: string;
    name: string;
    wish_id: string;
  }[];
}

export interface Wishes {
  amount: string;
  currency: "naira" | "dollar" | undefined;
  description: string;
  id: string;
  item: string;
  link: string;
  quantity: string;
  status: "unclaimed" | "claimed";
  wish_list: string;
}

export interface List {
  category: string;
  description: string;
  display_hex_code: string;
  expiry_date: string;
  id: string;
  title: string;
  user_id: string;
  wishes: [];
}

export type WishItemProps = {
  id?: string;
  name?: string;
  price?: string;
  claimed?: "claimed" | "unclaimed";
  currency?: "naira" | "dollar";
  slug?: string;
};

export type WishListItemProps = {
  isCard?: boolean;
  name?: string;
  expDate?: string;
  id?: string;
};

export type ProfileProps = {
  title: string | undefined;
  wishes: string | number | undefined;
  claims: string | number | undefined;
  link?: string;
};

export type ModalProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
};
