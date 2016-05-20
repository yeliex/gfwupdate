#!/usr/bin/env node

const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
require("node.date-time");

if (os.platform() != "darwin") {
  console.log("Error: Support OSX only");
  process.exit(-1);
}

(function () {
  console.log();
  console.log(new Date(), "更新git仓库");
  console.log();

  const child = childProcess.spawn("git", ["pull"], {
    cwd: process.cwd() + "/gfwlist"
  });

  child.stdout.on("data", function (data) {
    console.log(data.toString("utf-8"));
  });

  child.stderr.on("data", function (data) {
    console.log(data.toString("utf-8"));
  });

  child.on("exit", function (code, signal) {
    if (code != 0) {
      process.exit(code);
      return;
    }
    console.log(new Date(), "更新完成");
    // 开始读取文件
    var list = fs.readFileSync("./gfwlist/gfwlist.txt", "utf-8");
    console.log(new Date(), "解析完成");
    list = new Buffer(list, "base64").toString("utf-8");

    // 将文件内容写入配置文件
    const path = os.homedir() + "/.ShadowsocksX/user-rule.txt";
    fs.writeFileSync(path, list, "utf-8");

    var update = new Date();
    list = list.split("\n");
    for (var info of list) {
      if (info.match("Last Modified")) {
        update = new Date(info);
        break;
      }
    }

    console.log(new Date(), "更新完成,共 " + list.length + " 条记录");
    console.log(new Date(), "最近更新: " + update.format("Y-MM-dd HH:mm:SS"));
    console.log();
  });
}());