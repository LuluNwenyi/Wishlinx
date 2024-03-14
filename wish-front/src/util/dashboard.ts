export const genericTextFormat = (
  toFormat: string | number,
  suffix1: string,
  suffix2?: string
) => {
  let formatted = parseInt(toFormat as string);
  return formatted > 0 ? `${formatted} ${suffix2}` : `${formatted} ${suffix1}`;
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
  e: MouseEvent,
  containerRef: React.RefObject<HTMLDivElement>,
  cb: any
) => {
  if (
    containerRef.current &&
    !containerRef.current.contains(e.target as Node)
  ) {
    cb();
    console.log(e.AT_TARGET);
  }
};
