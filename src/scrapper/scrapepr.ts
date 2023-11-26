import puppeteer, { Browser } from "puppeteer";

class Scrapper {
    private Url: string;

    constructor(SiteUrl:string) {
        this.Url = SiteUrl;
    }

    async F1_schedule() {
        const Days:{[key:string | number]:any} = {};
        const month:{[key:string | number]:any} = {};
        const Circuit:{[key:string | number]:any} = {};
        const circuit_flag:{[key:string|number]:any} = {};
        const rounds:{[key:string | number]:any} = {};
        const CircuitWeekend:{[key:string | number]:any} = {};
        
        //load the basics for puppeter to work
        const browser = await puppeteer.launch({headless:'new'});
        const page = await browser.newPage();

        await page.goto(this.Url);
        /*
            What we need to F1 Schedule:
                Title; done
                Days; done
                Months; done
                Maybe round; done
                Circuit name; (ex:. Interlagos, yas marine, etc) done
                Podium;
        */
        
        //use class ou id's and type of the element to access the obejct, just like cheerio
        //title
        const titleTag = await page.waitForSelector('.f1-black--xxl.no-margin');
        const fulltitle = await titleTag?.evaluate((el) => el.textContent);
        
        //Rounds

        const roundTag = await page.$$eval('.card-title.f1-uppercase.f1-color--warmRed', option => option.map(option => option.textContent));

        roundTag.forEach((val:any, index:number) => {
            rounds[index] = val;
        })

        //days
        // const DayTag = await page.waitForSelector('.date-month.f1-uppercase.f1-wide--s > .no-margin > span');
        // const Days = await DayTag?.evaluate((el) => el.textContent);
        const StartDate_Tag = await page.$$eval('.date-month.f1-uppercase.f1-wide--s > .no-margin > .start-date', option => option.map(option => option.textContent));
        const EndDate_Tag = await page.$$eval('.date-month.f1-uppercase.f1-wide--s > .no-margin > .end-date', option => option.map(option => option.textContent));
        
        EndDate_Tag.forEach((val:any, index) => {
            Days[rounds[index]] = [StartDate_Tag[index], EndDate_Tag[index]].join("-"); // this index in Days need to be the rounds, so i need to scrap all the rounds, including test
        });

        //month
        const MonthTag = await page.$$eval('.month-wrapper.f1-wide--xxs', option => option.map(option => option.textContent));

        MonthTag.map((val, index:number) => {
            month[index] = val;
        })

        //circuit
        const CircuitTag = await page.$$eval('.event-place', option => option.map(option => option.textContent));
        CircuitTag.map((val, index:number) => {
            Circuit[index] = val?.trim();
        })

        //circuit_flag
        const imgTag = await page.$$eval('.country-flag > picture > img', option => option.map(option => option.getAttribute('data-src')));
        imgTag.map((val, index:number) => {
            circuit_flag[index] = val;
        })

        //returning
        for (let i in rounds) {
            CircuitWeekend[rounds[i]] = {
                "Circuit_name": Circuit[i],
                "Day": Days[rounds[i]],
                "Month": month[i],
                "Flag": circuit_flag[i]
            }
        }
        
        return CircuitWeekend;
    }
}

export default Scrapper;