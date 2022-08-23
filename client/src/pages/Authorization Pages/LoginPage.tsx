import styled from 'styled-components';
import { useAuth } from '../../providers/authProvider';

import { Link } from 'react-router-dom';
import { AutoForm, AutoField } from 'uniforms-unstyled';
import { SubmitField } from '../../components/FormFields/SubmitField';
import { bridge } from '../../schema/bridge';
import { loginSchema } from '../../schema/loginSchema';
import { useNavigate } from 'react-router-dom';

const schema = bridge(loginSchema);
const authError = { message: 'Invalid username or password' };
const error = false;

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (model: Record<string, any>) => {
    try {
      await login(model);

      if (user) {
        navigate('/sportTerms');
      }
    } catch (error) {
      console.log(error);
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
          <AutoForm schema={schema} onSubmit={onSubmit}>
            <AutoField
              name="username"
              className="form-login-input"
              placeholder="Korisničko ime"
              authError={error ? authError : null}
              label="Korisničko ime"
            />
            <AutoField
              name="password"
              className="form-login-input"
              placeholder="Lozinka"
              authError={error ? authError : null}
              label="Lozinka"
            />
            <div className="submit-cont">
              <SubmitField title="Prijava" className="btn form-submit-btn" />
              <p>
                Nemaš korisnički račun?{' '}
                <Link to="/register" className="register-link">
                  Registracija
                </Link>
              </p>
            </div>
          </AutoForm>
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  display: grid;
  grid-template-columns: 2fr 3fr;
  height: 100vh;

  .left {
    background-color: var(--text-color);
    height: 100%;
  }

  .right {
    padding: 3rem 2rem;
    display: grid;
    justify-content: center;

    .title {
      margin-bottom: 2rem;
    }

    .content {
      max-width: 30rem;
    }
  }
`;
