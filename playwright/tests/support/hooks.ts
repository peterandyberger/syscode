import { Before, After, AfterStep, Status } from "@cucumber/cucumber";
import { CustomWorld } from "./world";
import fs from "fs";
import path from "path";

Before(async function (this: CustomWorld) {
  await this.init();
});

After(async function (this: CustomWorld, scenario) {
  if (scenario.result?.status === Status.FAILED) {
    const png = await this.page.screenshot();
    const filepath = path.join("reports", "screenshots", `${Date.now()}.png`);
    fs.mkdirSync(path.dirname(filepath), { recursive: true });
    fs.writeFileSync(filepath, png);
    await this.attach(png, "image/png"); // still attach to report too
  }
  await this.cleanup();
});
