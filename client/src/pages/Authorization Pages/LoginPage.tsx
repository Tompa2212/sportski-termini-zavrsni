import styled from 'styled-components';
import { useAuth } from '../../providers/authProvider';
import loginImg from '../../assets/login-bg.jpg';
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
      margin-bottom: 2rem;
    }

    .content {
      max-width: 30rem;
      margin: 0 auto;
    }
  }
`;
