import { chromium, devices } from "playwright";
import {
  RemoveGoogleIframe,
  GetContactInfo,
  GetExperiences,
  GetSkills,
  Login,
} from "./utils";

const LOGIN_URL = "https://www.linkedin.com/login";
const USERNAME = "";
const PASSWORD = "";
const TOTP_SECRET = "";

// Setup
const browser = await chromium.launch({
  headless: false,
  slowMo: 50,
  devtools: false,
});

// The browser sesh
const context = await browser.newContext({
  storageState: "./pw",
});

// await Login(context, LOGIN_URL, USERNAME, PASSWORD, TOTP_SECRET);

// Open a new tab now and go to the profile page
const profilePage = await context.newPage();
const experiences = await GetExperiences(
  context,
  "https://www.linkedin.com/in/tantara"
);
const contactInfo = await GetContactInfo(
  context,
  "https://www.linkedin.com/in/tantara"
);
const skills = await GetSkills(context, "https://www.linkedin.com/in/tantara");

console.log(experiences);
console.log(contactInfo);
console.log(skills);

// Teardown
await context.close();
await browser.close();
