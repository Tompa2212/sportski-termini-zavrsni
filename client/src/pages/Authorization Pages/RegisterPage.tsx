import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { SubmitField } from '../../components/FormFields/SubmitField';
import { useAuth } from '../../providers/authProvider';

import loginImg from '../../assets/login-bg.jpg';
import TextField from '../../components/FormFields/TextField';
import React from 'react';
import { PasswordProvider } from '../../components/FormFields/PasswordProvider';
import { PasswordField } from '../../components/FormFields/PasswordField';
import { ConfirmPassword } from '../../components/FormFields/ConfirmPassword';
import { ImageField } from '../../components/FormFields/ImageFields';

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const getRegisterFormErrors = () => {
  const username = (value: string) => {
    if (value === '' || value.length < 6 || value.length > 15) {
      return false;
    }

    return true;
  };

  const email = (email: string) => {
    return (
      email
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ) !== null
    );
  };

  const password = (value: string) => value.length >= 8;
  const confirmPassword = (value: string) => value.length >= 8;

  return {
    username,
    email,
    password,
    confirmPassword,
  };
};

const registerFormErrors = getRegisterFormErrors();

export const RegisterPage = () => {
  const { register } = useAuth();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const fieldValues = Object.fromEntries(formData.entries());

    if (fieldValues.password !== fieldValues.confirmPassword) {
      return;
    }

    const isValid = Object.entries(fieldValues).every(([field, value]) => {
      if (typeof value === 'string') {
        return registerFormErrors[field as keyof RegisterFormData](value);
      }

      return true;
    });

    if (isValid) {
      await register(formData);
    }
  };

  return (
    <Wrapper>
      <div className="left"></div>
      <div className="right">
        <div className="content">
          <div className="title">
            <h1>Sportski Termini</h1>
            <h2>Zaigraj svoje najdraže sportove i upoznaj nove ljude!</h2>
          </div>
          <form noValidate onSubmit={onSubmit}>
            <TextField name="username" label="Korisničko ime" />
            <TextField name="email" type="email" label="Email" />
            <PasswordProvider>
              <PasswordField name="password" label="Lozinka" />
              <ConfirmPassword name="confirmPassword" label="Potvrdi lozinku" />
            </PasswordProvider>
            <ImageField
              name="profilePhoto"
              label="Profilna fotografija"
              id={'profilePhoto'}
            />
            <div className="submit-cont">
              <SubmitField
                title="Registracija"
                className="btn form-submit-btn"
                formData={{ dinamo: '1' }}
              />
              <p>
                Već imaš korisnički račun?{' '}
                <Link to="/login" className="register-link">
                  Prijava
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  display: grid;
  grid-template-columns: 3fr 4fr;
  height: 100vh;

  .left {
    display: grid;
    justify-content: center;

    background-color: var(--text-color);
    background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
      url(${loginImg});
    background-position: center;
    background-size: cover;
    height: 100%;

    color: var(--white);
  }

  .right {
    padding: 2rem;

    .title {
      margin-bottom: 2rem;
    }

    .content {
      max-width: 30rem;
      margin: 0 auto;
    }
  }
`;
