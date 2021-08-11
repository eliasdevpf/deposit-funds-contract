async function main() {
  // We get the contract to deploy
  const Game = await ethers.getContractFactory('Game');
  const gameContract = await Game.deploy();

  console.log('GameContract deployed to:', gameContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
