import {Page, Request, expect, test} from '@playwright/test'
import { giftSubscriptionPageUrl, modifyCartApiUrl } from '../helpers/urls'
import { GiftSubscriptionPage } from '../pages/giftSubscriptionPage'
import { ScentType, SendDateTestId } from '../helpers/enums';
import { GiftSubscriptionFormData } from '../helpers/GiftSubscriptionFormData';
import { dateErrorTestId, emailErrorTestId, femaleRadioButton, nameErrorTestId } from '../helpers/dataTestIds';
import { faker } from '@faker-js/faker';
import { createAccountLabel } from '../helpers/locators';


var subscriptionPage: GiftSubscriptionPage;


test.beforeEach(async({page}) => {
    subscriptionPage = new GiftSubscriptionPage(page); 
    await subscriptionPage.open();
})



test('should show error for empty required fields', async ({page}) => {
    const dataToSend = new GiftSubscriptionFormData(); 
    await subscriptionPage.fillOutPageAndClickPay(dataToSend);
    // 
    await page.waitForSelector(`[data-testid="${nameErrorTestId}"]`);
    // await page.waitForTimeout(500) //to render errors
    const nameError = await page.getByTestId(nameErrorTestId);
    const emailError = await page.getByTestId(emailErrorTestId);

    expect(nameError).toHaveText("Required")
    expect(emailError).toHaveText("Required")
})

test('should show error for the invalid email', async ({page}) => {
    const dataToSend = new GiftSubscriptionFormData()
        .setRecipientName(faker.person.firstName())
        .setRecipientEmail(faker.internet.email().replace("@", "-")); 
    await subscriptionPage.fillOutPageAndClickPay(dataToSend);
    // 
    await page.waitForSelector(`[data-testid="${emailErrorTestId}"]`);
    // await page.waitForTimeout(500) //to render error
    const emailError = await page.getByTestId(emailErrorTestId);

    expect(emailError).toHaveText("Valid email address required")
})

test('should show error for the wrong date', async ({page}) => {
    const currentYear = new Date().getFullYear();
    const dataToSend = new GiftSubscriptionFormData()
        .setRecipientName(faker.person.fullName())
        .setRecipientEmail(faker.internet.email())
        .setSendDate(SendDateTestId.sendLater)
        .setDateToSend(getFutureDate(-2)); 
    await subscriptionPage.fillOutPageAndClickPay(dataToSend);
    // 
    await page.waitForSelector(`[data-testid="${dateErrorTestId}"]`);
    // await page.waitForTimeout(500); //to render error
    const dateError = await page.getByTestId(dateErrorTestId);

    expect(dateError).toHaveText("Date must be in the future")
})

test('should pass with required fields only', async ({page, baseURL}) => {
    const dataToSend = new GiftSubscriptionFormData()
        .setRecipientName(faker.person.fullName().replace(".", ""))
        .setRecipientEmail(faker.internet.email());
    await subscriptionPage.fillOutPageAndClickPay(dataToSend);
    const formApiResponse = await page.waitForResponse(`*/**${modifyCartApiUrl}`);

    expect(formApiResponse.status()).toBe(200);
    assertApiRequest(dataToSend, formApiResponse.request().postDataJSON());
    await assertRedirectionToCreateAccountPage(page);
})

test('should pass with all fields', async ({page, baseURL}) => {
    const currentYear = new Date().getFullYear();
    const dataToSend = new GiftSubscriptionFormData()
        .setType(ScentType.perfume)
        .setRecipientName(faker.person.fullName().replace(".", "")) //a little bug (or feature). If a recipientName contains dot, the dot will not send
        .setRecipientEmail(faker.internet.email())
        .setPersonalMessage(faker.lorem.sentence())
        .setSenderName(faker.person.fullName()) 
        .setSendDate(SendDateTestId.sendLater)
        .setDateToSend(getFutureDate(5));
    await subscriptionPage.fillOutPageAndClickPay(dataToSend);
    const formApiResponse = await page.waitForResponse(`*/**${modifyCartApiUrl}`);

    expect(formApiResponse.status()).toBe(200);
    assertApiRequest(dataToSend, formApiResponse.request().postDataJSON());
    await assertRedirectionToCreateAccountPage(page);
})

function assertApiRequest(formData: GiftSubscriptionFormData, apiRequest: any) {
    if(formData.type != undefined) { 
        if(formData.type == ScentType.cologne){
            expect(apiRequest.variables.input.giftSubscriptionItem.recipient.gender).toEqual("MALE");}
        else {
            expect(apiRequest.variables.input.giftSubscriptionItem.recipient.gender).toEqual("FEMALE");}
    }
    if(formData.recipientName != undefined) {
        expect(apiRequest.variables.input.giftSubscriptionItem.recipient.name).toEqual(formData.recipientName);}
    if(formData.recipientEmail != undefined) {
        expect(apiRequest.variables.input.giftSubscriptionItem.recipient.email).toEqual(formData.recipientEmail);}
    if(formData.personalMessage != undefined) {
        expect(apiRequest.variables.input.giftSubscriptionItem.recipient.message).toEqual(formData.personalMessage);}
    if(formData.senderName != undefined) {
        expect(apiRequest.variables.input.giftSubscriptionItem.sender.name).toEqual(formData.senderName);}
    if(formData.dateToSend != undefined) {
        expect(apiRequest.variables.input.giftSubscriptionItem.recipient.date).toEqual(formData.dateToSend);}
}

async function assertRedirectionToCreateAccountPage(page: Page) {
    await page.waitForSelector(`[data-testid="${femaleRadioButton}"]`);
    const createAccountFormElement = await page.getByText(createAccountLabel);
    expect(createAccountFormElement).toBeVisible();
}

function getFutureDate(days: number): string {
    const today = new Date();
    const futureDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + days);
  
    const year = futureDate.getFullYear().toString().padStart(4, '0');
    const month = (futureDate.getMonth() + 1).toString().padStart(2, '0');
    const day = futureDate.getDate().toString().padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }

  


