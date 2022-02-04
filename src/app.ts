import express, { Application, Request, Response } from 'express'
import * as line from '@line/bot-sdk';
import axios from 'axios';

const app: Application = express();

const config = {
    channelAccessToken: 'RbgMHjW+FrjWJ3r31Et3aynM8zNLbVmoDpE93PTK/wv0X8HQHg+RxkPBXMUkVh+tnyJm6DvdF4zbfeKXyI/3ifpO+PQH/yGMrRNBSK/AtB7vKZecFpuifquNToBdAahLVcRnKIHDNF8RwG24O4uPjwdB04t89/1O/w1cDnyilFU=',
    channelSecret: '23b99b5cabbc705f4a68e34e8761e45c'
};

interface Covid {
    txn_date: string,
    new_case: number,
    total_case: number,
    new_case_excludeabroad: number,
    total_case_excludeabroad: number,
    new_death: number,
    total_death: number,
    new_recovered: number,
    total_recovered: number,
    update_date: string
}

// get covid data
async function covid_data(): Promise<string> {
    var url = 'https://covid19.ddc.moph.go.th/api/Cases/today-cases-all';
    var txt1: string;
    try {
        const response = await axios.get(url)
        console.log(response.data);
        txt1 = `ยอดโควิดประจำวันที่ ${String(response.data[0].txn_date)} ผู้ติดเชื้อ ${String(response.data[0].new_case)} คน หายป่วย  ${String(response.data[0].new_recovered)} คน `;
        //txt1 = String(response.data[0]["new_case"]);
        console.log(txt1);
        return txt1;
    } catch (error: any) {
        console.log(error.response.body);
    }
}

app.post('/webhook', line.middleware(config), (req: Request, res: Response) => {
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result));
});

const client = new line.Client(config);

async function handleEvent(event: any) {
    console.log(event);
    let text_req: string = event.message.text;
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }
    if (text_req == "เหี้ย") {
        return client.replyMessage(event.replyToken, {
            "type": "image",
            "originalContentUrl": "https://thaipublica.org/wp-content/uploads/2019/03/prayut_officail-620x613.jpg",
            "previewImageUrl": "https://thaipublica.org/wp-content/uploads/2019/03/prayut_officail-620x613.jpg"
        });
    }
    else if (text_req == "โควิด") {
        let _covid: string = await covid_data();
        return client.replyMessage(event.replyToken, {
            "type": 'text',
            "text": _covid
        });
    }
    else {
        return client.replyMessage(event.replyToken, {
            "type": 'text',
            "text": text_req
        });
    }

}

app.listen(5555, () => {
    console.log("Application is running!");
})