export const genericTextFormat = (
  toFormat: string | number,
  suffix1: string,
  suffix2?: string
) => {
  let formatted = parseInt(toFormat as string);

  if (isNaN(formatted) || formatted < 1) {
    return `0 ${suffix1}`;
  }
  if (formatted === 1) {
    return `1 ${suffix1}`;
  }
  return `${formatted} ${suffix2 || suffix1}`;
};

export const handleInputEnter = (e: any) => {
  const { keyCode, target } = e;
  if (keyCode === 13) {
    e.preventDefault();
    const form = target.form;
    const index = Array.prototype.indexOf.call(form, target);
    form.elements[index].blur();
    const cta = form.querySelector(".submit_btn");
    return cta.click();
  }
};

export const handleClickAway = (
  event: MouseEvent,
  ref: React.RefObject<HTMLDivElement>,
  callback: () => void
) => {
  if (ref.current && !ref.current.contains(event.target as Node)) {
    callback();
  }
};
