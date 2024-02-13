const { console, process } = globalThis;

export default msg => {
  console.error(msg);
  process.exit(1);
};
