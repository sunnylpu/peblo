import { prisma } from './src/utils/db';
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
