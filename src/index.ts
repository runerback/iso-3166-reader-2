import { Config, CountryData, CountryModel, LinkedData } from './module';
import request from './request';
import matches from './matches';
import fs from 'fs';
import path from 'path';
import { URL } from 'url';
import { Pattern } from './patterns';

const _config = readConfig();

read(_config)
    .then((data: CountryModel[]) => {
        fs.writeFileSync(
            _config.output,
            JSON.stringify(data, null, '  ')
        );
        console.log('done');
    })
    .catch((error: Error) => console.error(error));

function readConfig(): Config {
    const { rootURL, cachePath, output } = (<Config>JSON.parse(fs.readFileSync(
        path.resolve('./config.json'),
        'utf-8')));

    const safeCachePath = path.resolve(cachePath);
    if (!fs.existsSync(safeCachePath)) {
        fs.mkdirSync(safeCachePath);
    }

    return {
        rootURL: rootURL,
        cachePath: safeCachePath,
        output: path.resolve(output)
    };
}

async function read(config: Config): Promise<CountryModel[]> {
    const countries = Array<CountryModel>();

    const rootHtml = await request(config.rootURL, config);

    for (const linkedData of iterator(rootHtml, config)) {
        countries.push({
            name: linkedData.name,
            code2: linkedData.data!.code2,
            code3: linkedData.data!.code3,
            code: linkedData.data!.code,
            flag: await request(linkedData.data!.flag, config)
        });
    }

    return countries;
}

function* iterator(html: string, config: Config): IterableIterator<LinkedData<CountryData>> {
    for (const group of matches(Pattern, ['g', 'i', 's'], html)) {
        yield {
            name: group['name'].valueOf(),
            url: '',
            data: {
                code2: group['code2'].valueOf(),
                code3: group['code3'].valueOf(),
                code: group['code'].valueOf(),
                flag: new URL(config.rootURL).protocol + group['flag'].valueOf()
            }
        };
    }
}