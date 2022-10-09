const formatDateKey = ({
  day,
  month,
  year,
}: {
  day: number;
  month: number;
  year: number;
}) => {
  return `${year}-${month}-${day}`;
};

export default formatDateKey;
