import yargs from "yargs"
import { hideBin } from "yargs/helpers";

import { createMd } from "./modules/create.js";
import { pipeIntoClipboard } from "./modules/clipboard.js";


const argv = yargs(hideBin(process.argv))
    .command("create", "create md", {
        url: {
            alias: "u",
            describe: "problem url",
            type: "string",
            demandOption: true,
        },
        dir: {
            alias: "d",
            describe: "output directory",
            type: "string",
            demandOption: true,
        }
    })
    .command("clipboard", "pipe into clipboard", {
        url: {
            alias: "u",
            describe: "problem url",
            type: "string",
            demandOption: true,
        },
    })
    .help()
    .alias("help", "h")
    .argv;

// 根据不同的命令执行不同的逻辑
switch (argv._[0]) {
    case "create":
        createMd(argv.url, argv.dir)
        break;
    case "clipboard":
        pipeIntoClipboard(argv.url)
        break;
    default:
        console.log("Unknown command. Use --help to see available commands.");
}

