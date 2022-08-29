import { connectField } from 'uniforms';
import { ConnectedFieldProps } from 'uniforms';
import { Checkbox } from '../Checkbox';

const BooleanField = (props: ConnectedFieldProps<any>) => {
  return (
    <div className="form-control">
      <label className="form-label" style={{ visibility: 'hidden' }}>
        aa
      </label>
      <Checkbox
        checked={props.value || false}
        onChange={(value) => props.onChange && props.onChange(value)}
        label={props.label}
      />
    </div>
  );
};

export default connectField(BooleanField, { initialValue: false });
