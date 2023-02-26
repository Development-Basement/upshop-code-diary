import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type FC } from "react";
import { useForm } from "react-hook-form";
import { type SubmitHandler } from "react-hook-form/dist/types";
import { z } from "zod";
import { api } from "../utils/api";
import Pagination from "./pagination";
import ProfileDisplay from "./profileDisplay";

type UserFormProps = {
  closeForm: () => void;
};

type CreateUserFormProps = {} & UserFormProps;

type EditUserFormProps = {
  type: "create" | "edit";
  editedUserId?: string;
} & UserFormProps;

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
      {profiles.map((profile) => {
        return <ProfileDisplay {...profile} key={profile.id} />;
      })}
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

const CreateUserForm: FC<CreateUserFormProps> = ({ closeForm }) => {
  const validationSchema = z
    .object({
      username: z.string().regex(/^[a-zA-Z0-9-_]{3,15}$/), // 3-15 chars, letters, numbers, - and _,
      password: z.string().min(6).regex(/^\S*$/), // no whitespace
      confirmPassword: z.string().min(6).regex(/^\S*$/),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passwords don't match",
    });
  type ValidationSchema = z.infer<typeof validationSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({ resolver: zodResolver(validationSchema) });
  const utils = api.useContext();
  const { mutate: createUser, error: creationError } =
    api.users.createUser.useMutation();
  const onSubmit: SubmitHandler<ValidationSchema> = (data) => {
    const { confirmPassword, ...rest } = data;
    createUser(rest, {
      onSuccess: () => {
        closeForm();
        void utils.users.listUsers.invalidate();
      },
    });
  };
  const isError =
    creationError !== null ||
    [errors.username, errors.password, errors.confirmPassword].some(
      (error) => error !== undefined,
    );
  return (
    <div className="my-2 h-fit bg-tsbg1 p-5 shadow-thin-under-strong">
      <form
        className="flex w-full flex-col gap-3"
        onSubmit={(e) => void handleSubmit(onSubmit)(e)}
      >
        <h2 className="text-lg text-white">Add new user</h2>
        <label className="input-group w-full">
          <span className="w-52">Username</span>
          <input
            type="text"
            placeholder="username"
            className={`input w-full ${
              errors.username ? "input-error" : "input-primary"
            }`}
            {...register("username")}
          />
        </label>
        <label className="input-group w-full">
          <span className="w-52">Password</span>
          <input
            type="password"
            placeholder="password"
            className={`input w-full ${
              errors.password ? "input-error" : "input-primary"
            }`}
            {...register("password")}
          />
        </label>
        <label className="input-group w-full">
          <span className="w-52">Confirm password</span>
          <input
            type="password"
            placeholder="confirm password"
            className={`input w-full ${
              errors.confirmPassword ? "input-error" : "input-primary"
            }`}
            {...register("confirmPassword")}
          />
        </label>
        {isError && (
          <div className="mt-2 flex flex-col gap-2 rounded-md text-error">
            {errors.username && (
              <p>
                Username must be between 3 and 15 characters long and only
                contain letters, numbers, - and _!
              </p>
            )}
            {errors.password && (
              <p>
                Password must be at least 6 characters long and must not contain
                whitespace!
              </p>
            )}
            {errors.confirmPassword && (
              <p>Passwords don&apos;t match! Please try again.</p>
            )}
            {creationError && (
              <p>There was an error creating user: {creationError.message}</p>
            )}
          </div>
        )}

        <div className="mt-2 flex flex-row">
          <button className="btn-primary btn order-last" type="submit">
            create
          </button>
          <button className="btn mr-auto" type="reset" onClick={closeForm}>
            close
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManageUsers;
