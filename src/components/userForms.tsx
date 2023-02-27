import { Dialog, Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fragment, useRef, useState, type FC } from "react";
import { useForm } from "react-hook-form";
import { type SubmitHandler } from "react-hook-form/dist/types";
import { z } from "zod";
import { api } from "../utils/api";

type UserFormProps = {
  closeForm: () => void;
};

type CreateUserFormProps = UserFormProps;

type EditUserFormProps = {
  initialUsername: string;
  userId: string;
} & UserFormProps;

const usernameSchema = z.string().regex(/^[a-zA-Z0-9-_]{3,15}$/); // 3-15 chars, letters, numbers, - and _
const passwordSchema = z.string().min(6).regex(/^\S*$/); // no whitespace

export const CreateUserForm: FC<CreateUserFormProps> = ({ closeForm }) => {
  const validationSchema = z
    .object({
      username: usernameSchema,
      password: passwordSchema,
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
  type ValidationSchema = z.infer<typeof validationSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({ resolver: zodResolver(validationSchema) });
  const utils = api.useContext();
  const {
    mutate: createUser,
    error: creationError,
    isLoading: creatingUser,
  } = api.users.createUser.useMutation();
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
          <span className="w-40 shrink-0">Username</span>
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
          <span className="w-40 shrink-0">Password</span>
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
          <span className="w-40 shrink-0">Confirm password</span>
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
          <div className="mt-2 flex flex-col gap-2 text-error">
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
          <button
            className={`btn-primary btn order-last ${
              creatingUser ? "loading" : ""
            }`}
            disabled={creatingUser}
            type="submit"
          >
            {creatingUser ? "creating..." : "create"}
          </button>
          <button className="btn mr-auto" type="button" onClick={closeForm}>
            close
          </button>
        </div>
      </form>
    </div>
  );
};

export const EditUserForm: FC<EditUserFormProps> = ({
  closeForm,
  initialUsername,
  userId,
}) => {
  const usernameValidationSchema = z
    .object({
      username: usernameSchema,
    })
    .refine((data) => data.username !== initialUsername, {
      message: "Username must be different from the current one",
      path: ["username"],
    });
  const passwordValidationSchema = z
    .object({
      password: passwordSchema,
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
  type UsernameValidationSchema = z.infer<typeof usernameValidationSchema>;
  type PasswordValidationSchema = z.infer<typeof passwordValidationSchema>;
  const {
    register: registerUsername,
    handleSubmit: handleSubmitUsername,
    formState: { errors: usernameErrors },
  } = useForm<UsernameValidationSchema>({
    resolver: zodResolver(usernameValidationSchema),
    defaultValues: { username: initialUsername },
  });
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordValidationSchema>({
    resolver: zodResolver(passwordValidationSchema),
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const utils = api.useContext();
  const {
    mutate: changeUsername,
    error: usernameError,
    isLoading: changingUsername,
  } = api.users.changeUsername.useMutation();
  const {
    mutate: changePassword,
    error: passwordError,
    isLoading: changingPassword,
  } = api.users.changePassword.useMutation();
  const {
    mutate: deleteUser,
    error: deletionError,
    isLoading: deletingUser,
  } = api.users.deleteUser.useMutation();
  const onSubmitUsername: SubmitHandler<UsernameValidationSchema> = (data) => {
    changeUsername(
      { userId, newUsername: data.username },
      {
        onSuccess: () => {
          closeForm();
          void utils.users.listUsers.invalidate();
        },
      },
    );
  };
  const onSubmitPassword: SubmitHandler<PasswordValidationSchema> = (data) => {
    changePassword(
      { userId, newPassword: data.password },
      {
        onSuccess: () => {
          closeForm();
          void utils.users.listUsers.invalidate();
        },
      },
    );
  };
  const onDeleteUser = () => {
    deleteUser(
      { userId },
      {
        onSuccess: () => {
          closeForm();
          void utils.users.listUsers.invalidate();
        },
      },
    );
  };
  return (
    <>
      <div className="my-2 flex h-fit flex-col gap-3 bg-tsbg1 p-5 shadow-thin-under-strong">
        <h2 className="text-lg text-white">
          Editting user <span className="font-semibold">{initialUsername}</span>
        </h2>
        <form
          className=""
          onSubmit={(e) => void handleSubmitUsername(onSubmitUsername)(e)}
        >
          <label className="input-group w-full">
            <span className="w-40 shrink-0">Username</span>
            <input
              type="text"
              placeholder="username"
              className={`input w-full ${
                usernameErrors.username ? "input-error" : "input-primary"
              }`}
              {...registerUsername("username")}
            />
            <button
              className={`btn-primary btn order-last ${
                changingUsername ? "loading" : ""
              }`}
              disabled={changingUsername}
              type="submit"
            >
              {changingUsername ? "changing..." : "change"}
            </button>
          </label>
          {(usernameErrors.username || usernameError) && (
            <div className="mt-1 flex flex-col gap-2 text-error">
              {usernameErrors.username && (
                <p>
                  {usernameErrors.username.ref?.value === initialUsername
                    ? "Username must be different from the current one!"
                    : "Username must be between 3 and 15 characters long and only contain letters, numbers, - and _!"}
                </p>
              )}
              {usernameError && (
                <p>
                  There was an error chaning username: {usernameError.message}
                </p>
              )}
            </div>
          )}
        </form>
        <span className="divider my-0" />
        <form
          className=""
          onSubmit={(e) => void handleSubmitPassword(onSubmitPassword)(e)}
        >
          <div className="flex gap-4">
            <div className="flex w-full flex-col gap-2">
              <label className="input-group">
                <span className="w-40 shrink-0">New password</span>
                <input
                  type="password"
                  placeholder="password"
                  className={`input w-full ${
                    passwordErrors.password ? "input-error" : "input-primary"
                  }`}
                  {...registerPassword("password")}
                />
              </label>
              <label className="input-group">
                <span className="w-40 shrink-0">Confirm password</span>
                <input
                  type="password"
                  placeholder="confirm password"
                  className={`input w-full ${
                    passwordErrors.confirmPassword
                      ? "input-error"
                      : "input-primary"
                  }`}
                  {...registerPassword("confirmPassword")}
                />
              </label>
            </div>
            <button
              className={`btn-primary btn mt-auto ${
                changingPassword ? "loading" : ""
              }`}
              disabled={changingPassword}
              type="submit"
            >
              {changingPassword ? "changing..." : "change"}
            </button>
          </div>
          {(passwordErrors.password ||
            passwordErrors.confirmPassword ||
            passwordError) && (
            <div className="mt-1 flex flex-col gap-2 text-error">
              {passwordErrors.password && (
                <p>
                  Password must be at least 6 characters long and must not
                  contain whitespace!
                </p>
              )}
              {passwordErrors.confirmPassword && (
                <p>Passwords don&apos;t match!</p>
              )}
              {passwordError && (
                <p>
                  There was an error chaning username: {passwordError.message}
                </p>
              )}
            </div>
          )}
        </form>
        <div className="mt-2 flex flex-row">
          <button
            className="btn-error btn"
            disabled={deleteModalOpen}
            onClick={(e) => {
              e.preventDefault();
              setDeleteModalOpen(true);
            }}
          >
            delete
          </button>
          <button className="btn ml-auto" type="button" onClick={closeForm}>
            close
          </button>
        </div>
      </div>
      <Transition appear show={deleteModalOpen} as={Fragment}>
        <Dialog
          initialFocus={cancelButtonRef}
          onClose={() => {
            setDeleteModalOpen(false);
          }}
          className="relative z-50"
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>
          {/* Full-screen container to center the panel */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            {/* The actual dialog panel  */}
            <Dialog.Panel className="w-full max-w-lg overflow-hidden rounded-2xl bg-bgdark1 p-8 text-left align-middle text-white shadow-xl transition-all">
              <Dialog.Title as="h3" className="text-xl font-medium leading-6">
                Are you sure you want to delete this user?
              </Dialog.Title>
              <div className="mt-4 mb-6">
                <p className="text-sm text-neutral-content">
                  This action is permament and cannot be undone.
                </p>
                {deletionError && (
                  <p className="mt-2 text-sm text-error">
                    There was an error deleting the user:{" "}
                    {deletionError.message}
                  </p>
                )}
              </div>
              <div className="flex place-content-between">
                <button
                  ref={cancelButtonRef}
                  onClick={() => setDeleteModalOpen(false)}
                  className="btn-primary btn order-last"
                >
                  Cancel
                </button>
                <button
                  onClick={onDeleteUser}
                  className={`btn-error btn mr-auto ${
                    deletingUser ? "loading" : ""
                  }`}
                  disabled={deletingUser}
                >
                  {deletingUser ? "deleting..." : "confirm"}
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
