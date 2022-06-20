
  export const filterCustomers = (parsedName, input) => {
    return input.length && parsedName?.length && parsedName.includes(input);
  };