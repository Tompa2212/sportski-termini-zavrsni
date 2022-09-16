import SelectField from '../components/FormFields/SelectField';
import BooleanField from '../components/FormFields/BooleanField';
import LongText from '../components/FormFields/LongText';
import TextInput from '../components/FormFields/TextInput';
import DateTimeField from '../components/FormFields/DateTimeField';

export const createTermSchema = {
  title: 'Create Sport Term',
  type: 'object',
  properties: {
    sport: {
      type: 'object',
      uniforms: { component: SelectField },
      options: [
        {
          label: 'Nogomet',
          value: 'Nogomet',
        },
        {
          label: 'Košarka',
          value: 'Košarka',
        },
        {
          label: 'Tenis',
          value: 'Tenis',
        },
        {
          label: 'Badminton',
          value: 'Badminton',
        },
        {
          label: 'Stolni tenis',
          value: 'Stolni tenis',
        },
        {
          label: 'Šah',
          value: 'Šah',
        },
        {
          label: 'Padel',
          value: 'Padel',
        },
      ],
    },
    teamGame: {
      type: 'string',
      uniforms: { component: BooleanField },
    },
    pricePerPerson: {
      type: 'number',
      uniforms: { component: TextInput },
    },
    playersPerTeam: {
      type: 'number',
      uniforms: { component: TextInput },
    },
    playDate: {
      type: 'string',
      format: 'date',
      uniforms: { component: DateTimeField },
    },
    playTimeStart: {
      type: 'string',
      format: 'time',
      uniforms: { component: TextInput },
    },
    playTimeEnd: {
      type: 'string',
      format: 'time',
      uniforms: { component: TextInput },
    },
    address: {
      type: 'string',
      uniforms: { component: TextInput },
    },
    city: {
      type: 'string',
      uniforms: { component: TextInput },
    },
    country: {
      type: 'string',
      uniforms: { component: TextInput },
    },
    comment: {
      type: 'string',
      uniforms: { component: LongText },
    },
  },

  required: [
    'sport',
    'pricePerPerson',
    'address',
    'city',
    'country',
    'playDate',
    'playTimeStart',
    'playTimeEnd',
  ],
};

export const createSportTermLayout = [
  {
    fieldGroup: 'Sportski Termin',
    fields: [
      { name: 'sport', label: 'Sport' },
      { name: 'pricePerPerson', label: 'Cijena po osobi' },
      { name: 'playDate', label: 'Datum igranja' },
      { name: 'playTimeStart', label: 'Početak termina' },
      { name: 'playTimeEnd', label: 'Kraj termina' },
      { name: 'teamGame', label: 'Ekipno' },
      { name: 'playersPerTeam', label: 'Broj igrača po ekipi' },
    ],
  },
  {
    fieldGroup: 'Lokacija',
    fields: [
      { name: 'address', label: 'Adresa' },
      { name: 'city', label: 'Grad' },
      { name: 'country', label: 'Država' },
    ],
  },
  { fieldGroup: 'Dodatni podaci', fields: [{ name: 'comment', label: 'Komentar' }] },
];
