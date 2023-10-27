export const renderHumanDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
};

export const getNowString = () => {
  const date = new Date().toISOString();

  return date.split(/[\-:TZ\.]/).join("");
};
