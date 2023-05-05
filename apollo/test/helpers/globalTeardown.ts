import prismaClient from "../../src/internal/prismaClient";

module.exports = async function () {
  await prismaClient.$disconnect();
};
