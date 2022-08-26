export const toLocalDateString = (value: string) => {
  try {
    const date = new Date(value);

    return date.toLocaleDateString('hr-HR');
  } catch (error) {
    return value;
  }
};

export const toLocaleTimeString = (value: string) => {
  try {
    const dateString = new Date().toLocaleDateString();

    return new Date(`${dateString} ${value.slice(0, 5)}`).toLocaleTimeString(
      'hr-HR',
      {
        hour: '2-digit',
        minute: '2-digit',
      }
    );
  } catch (error) {
    return value;
  }
};
