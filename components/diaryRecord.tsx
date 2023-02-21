import type { FC } from "react";
import Stars from "./stars";

const DiaryRecord: FC = () => {
  return (
    <div className="h-fit p-5">
      <div className="mb-3 w-5">
        <span className="text-2xl">Albert Pátík</span>{" "}
        <span className="text-lg">- Typescript for 20 minutes</span>
        <p>21. 9. 2022 8:00AM</p>
      </div>
      <div>
        bcrebcrf rheuiahluae chaiuhcauvohri cuhaiulwncaec uhreabrvb rahvlkerbe
        hvalkvhb rbvahelvb rhvlabvalevhefb varlekvbaerlbvk vrekjabvlhfal
        rfbvklavfhlvkb rvh
      </div>
      <Stars rating={3} />
    </div>
  );
};

export default DiaryRecord;
