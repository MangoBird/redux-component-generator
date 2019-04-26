module.exports = function makeCamel(str) {
  const first = str.slice(0, 1);
  const rest = str.slice(1, str.length);

  return first.toUpperCase() + rest;
};
