import TextInput from '../components/FormFields/TextInput';
import SportsMultiSelect from '../pages/Authorization Pages/AuthFormComponents/SportsMultiSelect';

export const registerSchema = {
  title: 'Register',
  type: 'object',
  properties: {
    username: {
      type: 'string',
      minLength: 5,
      uniforms: { component: TextInput },
    },
    email: {
      type: 'string',
      format: 'email',
      uniforms: { component: TextInput },
    },
    password: {
      type: 'string',
      minLength: 6,
      uniforms: { type: 'password', component: TextInput },
    },
    confirmPassword: {
      type: 'string',
      const: { $data: '1/password' },
      uniforms: { type: 'password', component: TextInput },
    },
    favoriteSports: {
      type: 'object',
      uniforms: { component: SportsMultiSelect },
    },
  },

  required: ['username', 'email', 'password', 'confirmPassword'],
};

export const registerFormFields = [
  { name: 'username', label: 'Korisničko ime' },
  { name: 'email', label: 'Email' },
  { name: 'password', label: 'Lozinka' },
  { name: 'confirmPassword', label: 'Potvrdi lozinku' },
  { name: 'favoriteSports', label: 'Najdraži sportovi' },
];
