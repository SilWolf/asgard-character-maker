export const renderHumanDate = (isoDate: string) => {
  return new Date(isoDate).toLocaleDateString();
};

export const getNowString = () => {
  const date = new Date().toISOString();

  return date.split(/[\-:TZ\.]/).join("");
};
