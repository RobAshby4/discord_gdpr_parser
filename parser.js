const map = new Map([
  [1, "one"],
  [2, "two"],
  [3, "three"],
]);

function main() {
  console.log("Hello world");
  console.log(map);
    
}

if (require.main === module) {
  main();
}
