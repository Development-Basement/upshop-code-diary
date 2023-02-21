import * as dayjs from "dayjs";
import * as duration from "dayjs/plugin/duration";
// types say it is a module with export default, but it is not

dayjs.extend(duration);

export { dayjs as dayts };
