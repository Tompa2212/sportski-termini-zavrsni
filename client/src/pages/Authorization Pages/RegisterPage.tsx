import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { AutoForm, AutoField } from 'uniforms-unstyled';
import { SubmitField } from '../../components/FormFields/SubmitField';
import { useAuth } from '../../providers/authProvider';
import { bridge } from '../../schema/bridge';
import { registerSchema, registerFormFields } from '../../schema/registerSchema';
import loginImg from '../../assets/login-bg.jpg';

const schema = bridge(registerSchema);

const error = false;
const authError = 'Invalid credentials';

export const RegisterPage = () => {
  const { register } = useAuth();

  const onSubmit = async (model: Record<string, any>) => {
    await register(model);
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
          <AutoForm schema={schema} onSubmit={onSubmit}>
            {registerFormFields.map((field, index) => {
              return (
                <AutoField
                  key={index}
                  name={field.name}
                  label={field.label}
                  placeholder={field.label}
                  className="form-login-input"
                  authError={error ? authError : null}
                />
              );
            })}

            <div className="submit-cont">
              <SubmitField title="Registracija" className="btn form-submit-btn" />
              <p>
                Već imaš korisnički račun?{' '}
                <Link to="/login" className="register-link">
                  Prijava
                </Link>
              </p>
            </div>
          </AutoForm>
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
