const chalk = require("chalk");
const open = require("./src/open");
const proxy = require("./src/proxy");

const url = "https://invest.turingspace.com/";

async function run() {
  const data = await proxy.refresh();

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const { ip, port, protocol } = item;
    const proxyServer = `${
      protocol === "socks4/5" ? "socks5" : protocol
    }://${ip}:${port}`;
    const result = await open({
      proxyServer,
      url
    });

    console.log(
      proxyServer,
      result ? chalk.green(result) : chalk.red(result)
    );
  }
}
run();
