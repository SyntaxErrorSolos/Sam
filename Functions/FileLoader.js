const { glob } = require("glob");
const { promisify } = require("util");
const proGlob = promisify(glob);

module.exports = async function loadFiles(dirName) {
  const Files = await proGlob(
    `${process.cwd().replace(/\\/g, "/")}/${dirName}/**/*.js`
  );
  Files.forEach((file) => delete require.cache[require.resolve(file)]);
  return Files;
};
