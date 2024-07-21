const formatCurrency = (
  currency: "naira" | "dollar" | undefined,
  amount: string
): string => {
  if (currency === "naira") {
    return `₦${amount}`;
  } else {
    return `$${amount}`;
  }
};

export default formatCurrency;
