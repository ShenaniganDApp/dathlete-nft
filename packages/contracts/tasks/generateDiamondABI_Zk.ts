const fs = require("fs");
import { AbiCoder } from "@ethersproject/abi";
import { task } from "hardhat/config";

const basePath = "contracts/PART/facets/";
const libraryBasePath = "contracts/PART/libraries/";
const sharedLibraryBasePath = "contracts/shared/libraries/";

task(
  "diamondABI_Zk",
  "Generates ABI file for diamond, includes all ABIs of facets"
).setAction(async () => {
  let files = fs.readdirSync("./" + basePath);
  let abi: AbiCoder[] = [];
  for (const file of files) {
    const jsonFile = file.replace("sol", "json");
    let json = fs.readFileSync(`./artifacts-zk/${basePath}${file}/${jsonFile}`);
    json = JSON.parse(json);
    abi.push(...json.abi);
  }
  // files = fs.readdirSync("." + libraryBasePath);
  // for (const file of files) {
  //   const jsonFile = file.replace("sol", "json");
  //   let json = fs.readFileSync(
  //     `./artifacts-zk/${libraryBasePath}${file}/${jsonFile}`
  //   );
  //   json = JSON.parse(json);
  //   abi.push(...json.abi);
  // }
  files = fs.readdirSync("./" + sharedLibraryBasePath);
  for (const file of files) {
    const jsonFile = file.replace("sol", "json");
    let json = fs.readFileSync(
      `./artifacts-zk/${sharedLibraryBasePath}${file}/${jsonFile}`
    );
    json = JSON.parse(json);
    abi.push(...json.abi);
  }
  let finalAbi = JSON.stringify(abi);
  fs.writeFileSync("./diamondABI/diamond.json", finalAbi);
  console.log("ABI written to diamondABI/diamond.json");
});
