// @ts-nocheck

/* global ethers hre */
const diamond = require("../../js/diamond-util/src/index.ts");
import {
  utils as zkUtils,
  Wallet,
  ContractFactory as ZkSyncContractFactory,
  Provider,
} from "zksync-web3";
import { HardhatRuntimeEnvironment, Artifact } from "hardhat/types";
import { Deployer, Overrides } from "@matterlabs/hardhat-zksync-deploy";
import dotenv from "dotenv";

dotenv.config({ path: "./../../../.env" });

interface FactoryDeps {
  // A mapping from the contract hash to the contract bytecode.
  [contractHash: string]: string;
}

interface ZkSyncArtifact extends Artifact {
  // List of factory dependencies of a contract.
  factoryDeps: FactoryDeps;
  // Mapping from the bytecode to the zkEVM assembly (used for tracing).
  sourceMapping: string;
}

const L1_USDC_ADDRESS = "0xd35cceead182dcee0f148ebac9447da2c4d449c4";

let totalGasUsed = ethers.BigNumber.from("0");
const gasLimit = 12300000;

function addCommas(nStr: string) {
  nStr += "";
  const x = nStr.split(".");
  let x1 = x[0];
  const x2 = x.length > 1 ? "." + x[1] : "";
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, "$1" + "," + "$2");
  }
  return x1 + x2;
}

function strDisplay(str: string) {
  return addCommas(str.toString());
}

const extractFactoryDeps = async (
  hre: HardhatRuntimeEnvironment,
  artifact: ZkSyncArtifact
): Promise<string[]> => {
  // Load all the dependency bytecodes.
  // We transform it into an array of bytecodes.
  const factoryDeps: string[] = [];
  for (const dependencyHash in artifact.factoryDeps) {
    const dependencyContract = artifact.factoryDeps[dependencyHash];
    const dependencyBytecodeString = (
      await hre.artifacts.readArtifact(dependencyContract)
    ).bytecode;
    factoryDeps.push(dependencyBytecodeString);
  }

  return factoryDeps;
};

async function deployFacetsZkSync(
  facets: Promise<[ZkSyncArtifact, string[], Array<any>]>[],
  zkWallet: Wallet,
  overrides?: Overrides
) {
  const instances = [];
  for (let facet of facets) {
    const [artifact, factoryDeps, constructorArgs] = await facet;

    const factory = new ZkSyncContractFactory(
      artifact.abi,
      artifact.bytecode,
      zkWallet
    );
    const { feeToken, customData, ..._overrides } = overrides ?? {};

    // Encode and send the deploy transaction providing both fee token and factory dependencies.
    const facetInstance = await factory.deploy(...constructorArgs, {
      ..._overrides,
      customData: {
        ...customData,
        factoryDeps,
        feeToken: feeToken ?? customData?.feeToken ?? zkUtils.ETH_ADDRESS,
      },
    });

    await facetInstance.deployed();
    const tx = facetInstance.deployTransaction;
    const receipt = await tx.wait();
    console.log(
      `${artifact.contractName} deploy gas used:` +
        strDisplay(receipt.gasUsed.toString()) +
        ` to address: ${facetInstance.address}`
    );
    totalGasUsed = totalGasUsed.add(receipt.gasUsed);
    instances.push(facetInstance);
  }
  return instances;
}

export default async function (hre: HardhatRuntimeEnvironment) {
  const partAddress = "0xcd6eAF00b0fBf76Aa621c97bfE2Abb046B26F142";
  const name = "Dathlete";
  const symbol = "DATH";
  const constructorArguments = [
    [
      "0x2CC1F16b20F1eaD65Ad897808E569004295F8027",
      "0x2CC1F16b20F1eaD65Ad897808E569004295F8027",
      partAddress,
      name,
      symbol,
    ],
  ];
  const overrides = {};
  const additionalFactoryDeps = [];
  // const provider = new Provider(hre.userConfig.zkSyncDeploy?.zkSyncNetwork);
  const provider = new Provider("https://zksync2-testnet.zksync.dev");
  const wallet = new Wallet(process.env.PK, provider);
  const deployer = new Deployer(hre, wallet);
  const L2_USDC_ADDRESS = await provider.l2TokenAddress(L1_USDC_ADDRESS);

  const facetNames = [
    "ChallengesFacet",
    "ChallengeTransferFacet",
    "DAOFacet",
    "DathleteFacet",
    "ShopFacet",
  ];

  const facets = facetNames.map(async (facet) => {
    const artifact = await deployer.loadArtifact(facet);
    const factoryDeps = await extractFactoryDeps(hre, artifact);
    const constructorArgs: any[] = [];

    const deploymentFee = await deployer.estimateDeployFee(
      artifact,
      [],
      zkUtils.ETH_ADDRESS
    );

    const parsedFee = ethers.utils.formatUnits(deploymentFee.toString(), 18);
    console.log(
      `${artifact.contractName}:The deployment will cost ${parsedFee} ETH`
    );

    const f: [ZkSyncArtifact, string[], any[]] = [
      artifact,
      factoryDeps,
      constructorArgs,
    ];

    return f;
  });
  const [
    ChallengesFacet,
    ChallengeTransferFacet,
    DAOFacet,
    DathleteFacet,
    ShopFacet,
  ] = await deployFacetsZkSync(facets, wallet);

  const diamondArtifact = await deployer.loadArtifact("Diamond");

  const diamondBaseDeps = await deployer.extractFactoryDeps(diamondArtifact);
  const diamondAdditionalDeps = additionalFactoryDeps
    ? additionalFactoryDeps.map((val) => ethers.utils.hexlify(val))
    : [];

  const diamondFactoryDeps = [...diamondBaseDeps, ...diamondAdditionalDeps];

  const initArtifact = await deployer.loadArtifact(
    "contracts/Dathlete/InitDiamond.sol:InitDiamond"
  );

  const initBaseDeps = await deployer.extractFactoryDeps(initArtifact);
  const initAdditionalDeps = additionalFactoryDeps
    ? additionalFactoryDeps.map((val) => ethers.utils.hexlify(val))
    : [];

  const initFactoryDeps = [...initBaseDeps, ...initAdditionalDeps];

  const deploymentFee = await deployer.estimateDeployFee(
    diamondArtifact,
    [wallet.address],
    zkUtils.ETH_ADDRESS
  );

  const parsedFee = ethers.utils.formatUnits(deploymentFee.toString(), 18);
  console.log(
    `${diamondArtifact.contractName}: The deployment will cost ${parsedFee} ETH`
  );

  const dathleteDiamondContract = await diamond.deployZkSync({
    diamond: ["Diamond", diamondArtifact, diamondFactoryDeps, []],
    initDiamond: [
      "contracts/Dathlete/InitDiamond.sol:InitDiamond",
      initArtifact,
      initFactoryDeps,
      [],
    ],
    facets: [
      ["ChallengesFacet", ChallengesFacet],
      ["DathleteFacet", DathleteFacet],
      ["ChallengeTransferFacet", ChallengeTransferFacet],
      ["DAOFacet", DAOFacet],
      ["ShopFacet", ShopFacet],
    ],
    owner: wallet,
    args: constructorArguments,
    overrides,
  });
  console.log("Diamond address:" + dathleteDiamondContract.address);
}

// ChallengesFacet deploy gas used:0 to address: 0x1E398277f13A023d1D4f58eE2156dC5c4a75abEE
// ChallengeTransferFacet deploy gas used:0 to address: 0x4a282D525889b38869235FaC774F09E6Bf0EA25c
// DAOFacet deploy gas used:0 to address: 0x39a9C41955D698421e9511E340C001842F2dE8aA
// DathleteFacet deploy gas used:0 to address: 0x61C5eE25c52594A376aA5353206A2D85e1034921
// ShopFacet deploy gas used:0 to address: 0xa4F260bd5E4b5d5162bacbB0E1Fc901E496c6063
// Diamond address:0xbd528692046995C617C5c9BD928C2CdDcfF646c7
