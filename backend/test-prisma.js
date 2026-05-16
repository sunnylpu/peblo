const { PrismaClient } = require('@prisma/client');
const { withAccelerate } = require('@prisma/extension-accelerate');

const prisma = new PrismaClient().$extends(withAccelerate());

async function test() {
  try {
    await prisma.user.findMany();
    console.log("OK");
  } catch (err) {
    console.error("ERR MESSAGE:", err.message);
    console.error("ERR META:", JSON.stringify(err.meta));
    console.error("ERR CODE:", err.code);
  }
}
test();
