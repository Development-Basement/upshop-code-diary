import { useState, type FC } from "react";
import { api } from "../utils/api";
import Pagination from "./pagination";
import ProfileDisplay from "./profileDisplay";
import { CreateUserForm, EditUserForm } from "./userForms";

const ManageUsers: FC = () => {
  const { data } = api.users.listUsers.useInfiniteQuery(
    { limit: 20 },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  const [userFormState, setUserFormState] = useState<null | string>(null); // null for closed, "create" for create new user, user id for edit user
  const [page, setPage] = useState(0);

  const handleCreateNewUser = () => {
    setUserFormState("create");
  };

  const handleEditUser = (id: string) => {
    setUserFormState(id);
  };

  const { items: profiles } = data?.pages[page] ?? { items: [] };

  return (
    <>
      <div className="flex flex-row items-center bg-bgdark2 p-4">
        <h1 className="text-2xl uppercase">user management</h1>
        <button
          className="btn-outline btn-primary btn mr-2 ml-auto"
          onClick={handleCreateNewUser}
        >
          add new user
        </button>
      </div>
      {userFormState === "create" && (
        <CreateUserForm
          closeForm={() => {
            setUserFormState(null);
          }}
        />
      )}
      {profiles.map((profile) =>
        profile.id === userFormState ? (
          <EditUserForm
            closeForm={() => {
              setUserFormState(null);
            }}
            initialUsername={profile.name}
            userId={profile.id}
            key={profile.id}
          />
        ) : (
          <ProfileDisplay
            {...profile}
            key={profile.id}
            onEditClick={handleEditUser}
          />
        ),
      )}
      <div className="mt-4">
        <Pagination
          page={page}
          setPage={setPage}
          isLastPage={data?.pages[page]?.nextCursor === undefined}
        />
      </div>
    </>
  );
};

export default ManageUsers;
