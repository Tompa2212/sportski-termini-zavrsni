import { ConnectedFieldProps, connectField } from 'uniforms';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toDateString } from '../../utils/dateTime';

const createOnChangeValue = (value: Date | null) => {
  if (value === null) {
    return null;
  }

  return toDateString(value);
};

const createSelectedValue = (value: string | null) => {
  if (!value) {
    return null;
  }

  return new Date(value);
};

const DateTimeField = ({ value, onChange, label }: ConnectedFieldProps<any>) => {
  return (
    <div className="form-control">
      <label className="form-label">{label}</label>
      <DatePicker
        selected={createSelectedValue(value)}
        onChange={(value) => onChange && onChange(createOnChangeValue(value))}
        dateFormat="dd.MM.yyyy"
      />
    </div>
  );
};

export default connectField(DateTimeField, { initialValue: false });
