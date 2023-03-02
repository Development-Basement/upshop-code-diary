import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useState, type FC } from "react";
import { AiFillEdit } from "react-icons/ai";
import { DiaryRecord as DiaryRecordType } from "../server/api/routers/records";
import Stars from "./stars";

interface DiaryRecordProps extends DiaryRecordType {
  userId: string;
  userName: string;
}

const DiaryRecord: FC<DiaryRecordProps> = (props) => {
  const { data: session } = useSession();

  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
      {isEditing ? (
        <EditRecord {...props} setIsEditing={setIsEditing} />
      ) : (
        <ViewRecord
          {...props}
          serverUserId={session?.user.id ?? ""}
          setIsEditing={setIsEditing}
        />
      )}
    </div>
  );
};

export default DiaryRecord;

interface EditRecordProps extends DiaryRecordProps {
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}

const EditRecord: FC<EditRecordProps> = (props) => {
  const handleSubmit = () => {
    props.setIsEditing(false);
  };

  return (
    <div className="mt-2 h-fit bg-tsbg3 p-5 shadow-thin-under-strong">
      <p className="text-3xl text-white">{props.userName}</p>
      <p className="mb-2">{`${props.date.getDate()}. ${props.date.getMonth()}. ${props.date.getFullYear()}`}</p>
      <div className="mb-2">{props.description}</div>
      <Stars rating={props.rating} />
      <div className="flex w-full justify-end">
        <button className="btn-primary btn" onClick={handleSubmit}>
          Update
        </button>
      </div>
    </div>
  );
};

interface ViewRecordProps extends EditRecordProps {
  serverUserId: string;
}

const ViewRecord: FC<ViewRecordProps> = (props) => {
  return (
    <div className="mt-2 h-fit bg-tsbg1 p-5 shadow-thin-under-strong">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row text-xl">
          <p className="text-3xl text-white">{props.userName} -&nbsp;</p>
          <p className="mt-auto">
            <span className="text-action-500">{props.programmingLanguage}</span>{" "}
            for
            <span className="text-white">&nbsp;{props.timeSpent}</span>
          </p>
        </div>
        {props.userId === props.serverUserId && (
          <button
            onClick={() => {
              props.setIsEditing(true);
            }}
          >
            <AiFillEdit />
          </button>
        )}
      </div>
      <p className="mb-2">{`${props.date.getDate()}. ${props.date.getMonth()}. ${props.date.getFullYear()}`}</p>
      <div className="mb-2">{props.description}</div>
      <Stars rating={props.rating} />
    </div>
  );
};
