import dayjs from "dayjs";
import locale from "dayjs/locale/pt-br";
import format from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.locale(locale);
dayjs.extend(format);
dayjs.extend(relativeTime);

export default dayjs;
