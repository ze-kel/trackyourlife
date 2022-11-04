import { format } from "date-fns";

const formatDateKey = ({
  day,
  month,
  year,
}: {
  day: number;
  month: number;
  year: number;
}) => {
  const date = new Date(year, month, day);

  return format(date, "yyyy-MM-dd");
};

export default formatDateKey;
