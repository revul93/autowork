const isOptionsArray = (value) => {
  if (value) {
    try {
      const options = JSON.parse(value);
      const test_properties = options.every(
        (option) =>
          option.hasOwnProperty('name') && option.hasOwnProperty('value'),
      );

      const test_duplicates_keys =
        options.reduce(
          (acc, elem) => acc.add(elem['name'].toLowerCase()),
          new Set(),
        ).size === options.length;
      const test_duplicates_values =
        options.reduce(
          (acc, elem) => acc.add(elem['value'].toLowerCase()),
          new Set(),
        ).size === options.length;

      if (
        !(test_properties && test_duplicates_keys && test_duplicates_values)
      ) {
        console.log({
          test_properties,
          test_duplicates_keys,
          test_duplicates_values,
        });
        throw new Error(
          'Each option must have name and value field with no duplicates',
        );
      }
      return true;
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error('Operation must be formatted in JSON');
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
};

const handleErrors = (error, res) => {
  console.error(error);
  return res.status(500).json({
    message: 'Server error',
  });
};

module.exports = { isOptionsArray, handleErrors };
