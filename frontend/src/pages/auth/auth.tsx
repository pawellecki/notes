import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';
import { createForm } from '@felte/solid';
import toast from 'solid-toast';
import * as yup from 'yup';
import { validator } from '@felte/validator-yup';
import Box from '@suid/material/Box';
import Typography from '@suid/material/Typography';
import Input from '../../components/Form/Input/Input';
import Button from '../../components/Button/Button';
import { setLoggedInUser, setNotesPreview } from '../../../globalStore';
import logo from '../../assets/logo.png';
import { IsLoading } from '../../../globalTypes';

type FormValues = {
  email: string;
  password: string;
  name?: string;
};

const Auth: Component = () => {
  const [isLoginView, setIsLoginView] = createSignal(true);
  const [isLoading, setIsLoading] = createSignal<IsLoading>();

  const schema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().required(),
    name: yup.lazy(() =>
      isLoginView() ? yup.string() : yup.string().required()
    ),
  });

  const { form, reset, errors } = createForm({
    extend: validator({ schema }),
    onSubmit: async (values: FormValues) => {
      setIsLoading('true');

      if (isLoginView()) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URI}/users/login`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: values.email,
                password: values.password,
              }),
            }
          );
          const responseData = await response.json();

          if (!response.ok) {
            setIsLoading();
            return toast.error(responseData.message);
          }

          const { userId, email, token, notesPreview } = responseData;

          const userData = localStorage.getItem('userData') ?? '';
          const { expiration } = (userData && JSON.parse(userData)) ?? {};
          const newExpiration = new Date(
            new Date().getTime() + 1000 * 60 * 60
          ).toISOString();
          const tokenExpirationDate = expiration || newExpiration;

          localStorage.setItem(
            'userData',
            JSON.stringify({
              userId,
              email,
              token,
              expiration: tokenExpirationDate,
            })
          );

          setLoggedInUser({
            token,
            userId,
            email,
          });
          setNotesPreview(notesPreview);
        } catch (err) {
          if (err instanceof Error) {
            toast.error(err.message || 'Something went wrong');
          }

          setIsLoading();
        }
      } else {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URI}/users/signup`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: values.name,
                email: values.email,
                password: values.password,
              }),
            }
          );

          const responseData = await response.json();

          setIsLoading();

          if (!response.ok) {
            return toast.error(responseData.message);
          }

          setIsLoginView(true);
          toast.success('Now you can log in!');
        } catch (err) {
          if (err instanceof Error) {
            toast.error(err.message || 'Something went wrong');
          }

          setIsLoading();
        }
      }
    },
  });

  const loginInputs = (
    <>
      <Input label="Email" name="email" error={errors().email} />
      <Input
        label="Password"
        name="password"
        type="password"
        error={errors().password}
      />
    </>
  );

  const registerInputs = (
    <>
      <Input label="Name" name="name" error={errors().name} />
      <Input label="Email" name="email" error={errors().email} />
      <Input
        label="Password"
        name="password"
        type="password"
        error={errors().password}
      />
    </>
  );

  return (
    <div class="loginWrapper">
      <div class="loginBox">
        <img src={logo} alt="logo" />
        <form use:form>
          {isLoginView() && loginInputs}
          {!isLoginView() && registerInputs}
          <Box className="mainLoginButton">
            <Button type="submit" isLoading={isLoading()}>
              {isLoginView() && 'let me in!'}
              {!isLoginView() && 'sign up'}
            </Button>
          </Box>
        </form>
        <Typography>
          {isLoginView() && "Don't have an account?"}
          {!isLoginView() && 'Already have an account?'}
        </Typography>
        <Button
          variant="text"
          onClick={() => {
            reset();
            setIsLoginView((prev) => !prev);
          }}
          isDisabled={isLoading()}
        >
          {isLoginView() && 'sign up'}
          {!isLoginView() && 'login'}
        </Button>
      </div>
    </div>
  );
};

export default Auth;
