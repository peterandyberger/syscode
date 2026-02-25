import { setWorldConstructor, World, IWorldOptions } from "@cucumber/cucumber";
import {
  chromium,
  Browser,
  BrowserContext,
  Page,
  APIRequestContext,
  APIResponse,
  request,
} from "playwright";
import { FRONTEND_URL, BACKEND_URL } from "./env";

let sharedBrowser: Browser | null = null;

export interface TestWorld extends World {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  api: APIRequestContext;
  frontendUrl: string;
  backendUrl: string;
  createdStudentIds: string[];
  lastStudentId: string | null;
  lastResponse: APIResponse | null;
}

class CustomWorld extends World implements TestWorld {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  api!: APIRequestContext;
  frontendUrl = FRONTEND_URL;
  backendUrl = BACKEND_URL;
  createdStudentIds: string[] = [];
  lastStudentId: string | null = null;
  lastResponse: APIResponse | null = null;

  constructor(opts: IWorldOptions) {
    super(opts);
  }

  async init() {
    if (!sharedBrowser)
      sharedBrowser = await chromium.launch({ headless: !!process.env.CI });
    this.browser = sharedBrowser;
    this.context = await this.browser.newContext({ baseURL: FRONTEND_URL });
    this.page = await this.context.newPage();
    this.api = await request.newContext({ baseURL: BACKEND_URL });
  }

  async cleanup() {
    for (const id of this.createdStudentIds) {
      await this.api.delete(`/students/${id}`).catch(() => {});
    }
    await this.api.dispose();
    await this.context.close();
  }
}

setWorldConstructor(CustomWorld);
export { CustomWorld };
