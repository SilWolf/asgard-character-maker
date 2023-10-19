export const renderHumanDate = (isoDate: string) => {
  return new Date(isoDate).toLocaleDateString();
};
