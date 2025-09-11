import { format } from "date-fns";

export const formatDate = (date: Date) => format(date, "do MMMM yyyy");
