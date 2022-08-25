import axios from 'axios';
import { capitalize } from 'lodash';
import { useEffect, useState } from 'react';
import Select, { MultiValue } from 'react-select';
import { ConnectedFieldProps, connectField } from 'uniforms';
import { Sport } from '../../../models/Sport';

interface SportOption {
  value: Sport;
  label: string;
}

const transformToOptions = (sports: Sport[]) => {
  if (!sports) {
    return [];
  }

  return sports.map((sport) => ({
    value: { name: sport.name },
    label: capitalize(sport.name),
  }));
};

const transformToSport = (options: MultiValue<SportOption>) =>
  options.map((option) => ({ name: option.value.name }));

const getSportsUrl = 'http://localhost:3000/api/v1/sports';

const SportsMultiSelect = ({ onChange, value }: ConnectedFieldProps<any>) => {
  const [sportOptions, setSportOptions] = useState<SportOption[]>([]);

  useEffect(() => {
    const getSports = async () => {
      try {
        const resp = await axios.get(getSportsUrl);

        const sports = resp.data.sports as Sport[];

        setSportOptions(transformToOptions(sports));
      } catch (error) {
        setSportOptions([]);
      }
    };

    getSports();
  }, []);

  const onChangeWrapper = (values: MultiValue<SportOption>) => {
    if (!onChange) {
      return;
    }

    values.length === 0 ? onChange(null) : onChange(transformToSport(values));
  };

  return (
    <div className="form-control">
      <label className="form-label">Najdraži sportovi</label>
      <Select
        options={sportOptions}
        value={transformToOptions(value)}
        isMulti
        menuPortalTarget={document.body}
        menuPlacement="top"
        onChange={onChangeWrapper}
        closeMenuOnSelect={false}
        styles={{
          control: (styles, { isFocused }) => ({
            ...styles,
            background: 'var(--bg-color)',
            outline: isFocused ? '1px solid var(--primary)' : undefined,
            '$:hover': {
              borderColor: 'transparent',
              outlineColor: 'transparent',
            },
          }),
          option: (styles) => ({
            ...styles,
            ':active': {
              ...styles[':active'],
              outline: '1px solid var(--primary)',
            },
          }),
        }}
      />
    </div>
  );
};

export default connectField(SportsMultiSelect, { initialValue: false });
