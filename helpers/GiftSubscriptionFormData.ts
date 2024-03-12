import { ScentType, SendDateTestId } from "./enums";

export class GiftSubscriptionFormData {
    private _type: ScentType;
    private _rName: string;
    private _rEmail: string;
    private _personalMessage: string;
    private _senderName: string;
    private _sendDate: SendDateTestId;
    private _dateToSend: string;

    get type(): ScentType {
        return this._type;
    }
 
    get recipientName(): string {
        return this._rName;
    }

    get recipientEmail(): string {
        return this._rEmail;
    }

    get personalMessage(): string {
        return this._personalMessage;
    }

    get senderName(): string {
        return this._senderName;
    }

    get sendDate(): SendDateTestId {
        return this._sendDate;
    }

    get dateToSend(): string {
        return this._dateToSend;
    }
    

    setType(type: ScentType) {
        this._type = type;
        return this; 
    }

    setRecipientName(rName: string) {
        this._rName = rName;
        return this; 
    }

    setRecipientEmail(rEmail: string) {
        this._rEmail = rEmail;
        return this; 
    }


    setPersonalMessage(personalMessage: string) {
        this._personalMessage = personalMessage;
        return this; 
    }

    setSenderName(senderName: string) {
        this._senderName = senderName;
        return this; 
    }

    setSendDate(sendDate: SendDateTestId) {
        this._sendDate = sendDate;
        return this; 
    }

    setDateToSend(yyyymmddHyphenSeparated: string) {
        this._dateToSend = yyyymmddHyphenSeparated;
        return this; 
    }
    
    
}