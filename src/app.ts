import * as express from 'express'
import * as line from '@line/bot-sdk';
import covid_data from './CovidData';

const app: any = express;
const port: any = process.env.PORT || 5555;

const config = {
    channelAccessToken: 'RbgMHjW+FrjWJ3r31Et3aynM8zNLbVmoDpE93PTK/wv0X8HQHg+RxkPBXMUkVh+tnyJm6DvdF4zbfeKXyI/3ifpO+PQH/yGMrRNBSK/AtB7vKZecFpuifquNToBdAahLVcRnKIHDNF8RwG24O4uPjwdB04t89/1O/w1cDnyilFU=',
    channelSecret: '23b99b5cabbc705f4a68e34e8761e45c'
};

app.post('/webhook', line.middleware(config), (req: any, res: any) => {
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
    if (text_req.includes("โควิด") || text_req.toLowerCase().includes("covid")) {
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

app.listen(port, () => {
    console.log("Application is running!");
})