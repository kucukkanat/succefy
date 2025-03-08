import { Page, BrowserContext } from "playwright";
import { TOTP } from "otpauth";
const calculateTOTP = (secret: string) => {
  const token = new TOTP({ secret }).generate();
  return token;
};
async function FillInLoginForm(page: Page, username: string, password: string) {
  console.log("Filling in login form", username, password);
  await page.waitForTimeout(1000);
  await page.waitForSelector("#username");
  await page.waitForSelector("#password");
  await page.waitForTimeout(509);

  await page.fill("#username", username);
  await page.fill("#password", password);
  await page.click('[type="submit"]');
}

async function FillInTOTPForm(page: Page, secret: string) {
  await page.waitForSelector("[name=pin]");
  await page.waitForTimeout(307);

  await page.fill("[name=pin]", calculateTOTP(secret));
  await page.click('[type="submit"]');
}

export async function Login(
  context: BrowserContext,
  login_url,
  username: string,
  password: string,
  secret: string
) {
  const page = await context.newPage();
  await page.goto(login_url);
  console.log(`Logging in with ${username} and ${password}`);
  await FillInLoginForm(page, username, password);
  await FillInTOTPForm(page, secret);
  await page.close();
  await page.context().storageState({ path: "./pw" });
}

export async function GetExperiences(
  context: BrowserContext,
  profileUrl: string
) {
  const page = await context.newPage();
  await page.goto(`${profileUrl}/details/experience/`);
  await page.waitForSelector('li[class*="pvs-list__item--line-separated"]');
  await page.waitForTimeout(200);

  const xps = await page.evaluate(() => {
    const experienceListItems = document.querySelectorAll(
      'li[class*="pvs-list__item--line-separated"]'
    );
    const experiences: {
      title: string | null;
      company: string | null;
      duration: string | null;
      description: string | null;
      companyLink: string | null;
      imageUrl: string | null;
    }[] = [];

    experienceListItems.forEach((item: any) => {
      const titleElement = item.querySelector(
        '.mr1.t-bold > span[aria-hidden="true"]'
      );
      const companyElement = item.querySelector(
        '.t-14.t-normal > span[aria-hidden="true"]'
      );
      const durationElement = item.querySelector(
        '.t-14.t-normal.t-black--light > span[aria-hidden="true"]'
      );
      const descriptionElement = item.querySelector(
        '.t-14.t-normal.t-black > span[aria-hidden="true"]'
      );
      const linkElement = item.querySelector(
        'a[class="optional-action-target-wrapper"]'
      );

      const title = titleElement ? titleElement.textContent.trim() : null;
      const company = companyElement ? companyElement.textContent.trim() : null;
      const duration = durationElement
        ? durationElement.textContent.trim()
        : null;
      const description = descriptionElement
        ? descriptionElement.textContent.trim()
        : null;
      const link = linkElement ? linkElement.href : null;
      const imageUrlElement = item.querySelector('img[class*="evi-image"]');
      const imageUrl = imageUrlElement ? imageUrlElement.src : null;

      experiences.push({
        title: title,
        company: company,
        duration: duration,
        description: description,
        companyLink: link,
        imageUrl: imageUrl,
      });
    });

    return experiences;
  });
  await page.close();
  return xps;
}

export async function GetContactInfo(
  context: BrowserContext,
  profileUrl: string
) {
  const page = await context.newPage();
  await page.goto(`${profileUrl}/overlay/contact-info/`);
  const contactInfo = await page.evaluate(() => {
    const contactInfo = document.querySelector(
      ".pv-profile-section__section-info section-info"
    );
    return contactInfo ? contactInfo.textContent.trim() : null;
  });
  await page.close();
  return contactInfo;
}

export async function GetSkills(context: BrowserContext, profileUrl: string) {
  const page = await context.newPage();
  await page.goto(`${profileUrl}/details/skills/`);
  console.log(`Navigated to skills page`);
  await page.waitForSelector("[data-field=skill_page_skill_topic]");
  const skillList = await page.evaluate(() => {
    const skills = document.querySelectorAll(
      "[data-field=skill_page_skill_topic]"
    );
    console.log(`Collected skills`);
    const skillList: string[] = [];
    skills.forEach((skill: any) => {
      skillList.push(skill.textContent.trim());
    });
    return skillList;
  });
  await page.close();
  return skillList;
}

export async function RemoveGoogleIframe(page: Page) {
  console.log("Waiting for google iframe");
  try {
    await page.waitForSelector("iframe[title*='google dialog' i]", {
      timeout: 444,
    });
    await page.evaluate(() => {
      console.log("Removing google iframe");
      const iframe = document.querySelector("iframe[title*='google dialog' i]");
      iframe.remove();
    });
    console.log("Removed google iframe");
  } catch (e) {
    console.log("No google iframe found");
  }
  await page.close();
}
