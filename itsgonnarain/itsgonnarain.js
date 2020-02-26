console.log("It's gonna rain");

async function main() {
  const response = await fetch('gino_soccio_remember_loop.mp3');
  const arrayBuffer = await response.arrayBuffer();
  console.log('Received', arrayBuffer);
}

main();
