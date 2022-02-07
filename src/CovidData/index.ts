import axios from 'axios';

export default async function covid_data(): Promise<any> {
    var url = 'https://covid19.ddc.moph.go.th/api/Cases/today-cases-all';
    var txt1: string;
    try {
        const response = await axios.get(url)
        console.log(response.data);
        txt1 = `ยอดโควิดประจำวันที่ ${String(response.data[0].txn_date)} ผู้ติดเชื้อ ${String(response.data[0].new_case)} คน หายป่วย ${String(response.data[0].new_recovered)} คน เสียชีวิต ${String(response.data[0].new_death)} คน`;
        //txt1 = String(response.data[0]["new_case"]);
        console.log(txt1);
        return txt1;
    } catch (error: any) {
        console.log(error.response.body);
    }
}