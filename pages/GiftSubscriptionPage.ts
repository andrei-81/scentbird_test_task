import { Page } from "@playwright/test";
import { ScentType, SendDateTestId } from "../helpers/enums";
import { dateDayLabel, dateMonthLabel, dateYearLabel, payButtonLabel, personalMessageLabel, recipientEmailLabel, recipientNameLabel, yourNameLabel } from "../helpers/locators";
import { dateDayTestId, dateMonthTestId, dateYearTestId, recipientGenderRadioGroupTestId, sendDateRadioGroupTestId } from "../helpers/dataTestIds";
import { giftSubscriptionPageUrl } from "../helpers/urls";
import { GiftSubscriptionFormData } from "../helpers/GiftSubscriptionFormData";

export class GiftSubscriptionPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async open() {
        await this.page.goto(giftSubscriptionPageUrl)
    }

    async selectType(type: ScentType) {
        await this.page.getByRole("radio", {name: type}).click()
    }

    async enterRecipientName(recipientName: string) {
        await this.page.getByRole('textbox', {name: recipientNameLabel}).fill(recipientName)
    }

    async enterRecipientEmail(recipientEmail: string) {
        await this.page.getByRole('textbox', {name: recipientEmailLabel}).fill(recipientEmail)
    }

    async enterPersonalMessage(message: string) {
        await this.page.getByRole('textbox', {name: personalMessageLabel}).fill(message)
    }

    async enterYourName(name: string) {
        await this.page.getByRole('textbox', {name: yourNameLabel}).fill(name)
    }

    async selectSendDate(sendDate: SendDateTestId) { 
        await this.page.getByTestId(sendDate).click()
    }

    async setDate(yyyymmddHyphenSeparated: string) {
        var dateArray = yyyymmddHyphenSeparated.split('-');
        await this.page.getByTestId(dateMonthTestId).selectOption(dateArray[1].replace(/^0/, ''))
        await this.page.getByTestId(dateDayTestId).selectOption(dateArray[2].replace(/^0/, ''))
        await this.page.getByTestId(dateYearTestId).selectOption(dateArray[0])
    }

    async clickPay() {
        await this.page.getByRole('button', {name: payButtonLabel}).click()
    }

    async fillOutPageAndClickPay(dataToFill: GiftSubscriptionFormData) {
        if(dataToFill.type != undefined) { 
            await this.selectType(dataToFill.type);}
        if(dataToFill.recipientName != undefined) {
            await this.enterRecipientName(dataToFill.recipientName);}
        if(dataToFill.recipientEmail != undefined) {
            await this.enterRecipientEmail(dataToFill.recipientEmail);}
        if(dataToFill.personalMessage != undefined) {
            await this.enterPersonalMessage(dataToFill.personalMessage);}
        if(dataToFill.senderName != undefined) {
            await this.enterYourName(dataToFill.senderName);}       
        if(dataToFill.sendDate != undefined) {
            await this.selectSendDate(dataToFill.sendDate);}   
        if(dataToFill.dateToSend != undefined) {
            await this.setDate(dataToFill.dateToSend);}  

        await this.clickPay();
        
    }


}