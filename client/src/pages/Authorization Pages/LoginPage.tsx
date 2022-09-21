import styled from 'styled-components';
import { AuthStatus, useAuth } from '../../providers/authProvider';
import loginImg from '../../assets/login-bg.jpg';
import { Link } from 'react-router-dom';

import { SubmitField } from '../../components/FormFields/SubmitField';

import { useNavigate } from 'react-router-dom';
import TextField from '../../components/FormFields/TextField';
import React from 'react';

export default function LoginPage() {
  const { login, status } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const fieldValues = Object.fromEntries(formData.entries());

    await login(fieldValues);
    navigate('/');
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
          {status === AuthStatus.ERROR && (
            <span
              style={{
                color: 'var(--red)',
                marginBottom: '0.5rem',
                display: 'inline-block',
              }}
            >
              Neispravni podaci za prijavu.
            </span>
          )}
          <form noValidate onSubmit={onSubmit}>
            <TextField name="username" label="Korisničko ime" />
            <TextField name="password" label="Lozinka" type="password" />
            <div className="submit-cont">
              <SubmitField title="Prijava" className="btn form-submit-btn" />
              <p>
                Nemaš korisnički račun?{' '}
                <Link to="/register" className="register-link">
                  Registracija
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  display: grid;
  grid-template-columns: 3fr 4fr;
  height: 100vh;

  .left {
    display: grid;
    justify-content: center;
    padding: 20vh 2rem;

    background-color: var(--text-color);
    background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
      url(${loginImg});
    background-position: center;
    background-size: cover;
    height: 100%;

    color: var(--white);
  }

  .right {
    padding: 3rem 2rem;

    .title {
      margin-bottom: 1.5rem;
    }

    .content {
      max-width: 30rem;
      margin: 0 auto;
    }
  }
`;
