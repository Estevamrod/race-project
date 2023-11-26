import express, {Application, Request, Response} from 'express';
import Scrapper from './scrapper/scrapepr';

const app:Application = express();

app.use(express.json());

app.get('/', (req:Request, res:Response) => {
    return res.status(200).json({msg:'running'});
});

app.get('/F1_schedule', async(req:Request, res:Response) => {
    const scrapepr = new Scrapper('https://www.formula1.com/en/racing/2023.html');
    const resReturned = await scrapepr.F1_schedule();
    if (!resReturned) return res.status(203).json({msg:"Incappable to connect to the API, please try again", badRequest:true});
    return res.status(200).json({msg:'F1-Schedule-2023', "Schedule": resReturned});
})

export default app;