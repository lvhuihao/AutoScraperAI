import * as path from 'path';
import * as Puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { domEleFilter, simplifyDOMString, saveCSVToFileNode, sleep } from './helpers/commonHelper/index.js';
// import { getCompelite } from './helpers/llmHelper/gpt.ts';
import { getWebCompelite, getTableCompelite, getReginCompelite } from './helpers/llmHelper/langchain.js'

// 输入地址和想要获取的数据
let url = 'https://www.apple.com/retail/storelist/';
let dataDesc = '所有苹果零售商店所在的城市、街道地址、店铺电话等信息'

const webDataInfo = {
    "infoSelector": "",
    "regionSelector": "",
    "regionType": "",
    "regionNext": ""
}


console.log('开始')

// 打开网站，获取html数据
const browser = await Puppeteer.launch({
    headless: false,
    args: [
        // 设置窗口宽度和高度
        '--window-size=1920,1080',
        // 其他 Chromium 命令行参数...
    ],
});
const page = await browser.newPage();
// 设置页面的视口大小
await page.setViewport({
    width: 1440,
    height: 1080,
    deviceScaleFactor: 1, // 缩放因子
    isMobile: false, // 是否是移动设备
    hasTouch: false, // 是否有触摸支持，根据需要设置
});
console.log("进入网页");
console.log('请求网页地址:', url);
console.log('数据内容:', dataDesc);
await page.goto(url);
// await page.exposeFunction("domEleFilter", domEleFilter);
console.log("获取网页数据");
let body = await page.evaluate(() => {
    (window as any).domEleFilter = function domEleFilter(dom, tagNames) {
        if (!Array.isArray(tagNames)) {
            tagNames = [tagNames];
        }
        tagNames.forEach((tag) => {
            // 获取所有的script元素
            let tagNodes = dom.getElementsByTagName(tag);
            // 遍历并删除这些元素
            for (var i = tagNodes.length - 1; i >= 0; i--) {
                tagNodes[i].parentNode.removeChild(tagNodes[i]);
            }
        })
        console.log(dom)
        return dom;
    }
    // console.log((document.body.cloneNode(true) as HTMLElement).getElementsByTagName('script'))
    let cBody = document.body.cloneNode(true);
    (window as any).aBody = domEleFilter(cBody, ['script', 'style', 'svg'])
    // console.log(aBody.innerHTML)

    return (window as any).aBody.innerHTML
})
// console.log(body);

console.log('请求大模型')
console.log('获取网页信息')
let res = await getWebCompelite(body, dataDesc)
// let res: any = {
//     content: `{
//     "infoSelector": ".store-list-content",
//     "regionSelector": "#dropdown",
//     "regionType": "select",
//     "regionNext": null
// }` }
console.info('res.content');
console.log(res.content);
try {
    let data = JSON.parse(res.content.toString());
    webDataInfo.infoSelector = data.infoSelector ? data.infoSelector : '';
    webDataInfo.regionSelector = data.regionSelector ? data.regionSelector : '';
    webDataInfo.regionType = data.regionType ? data.regionType : '';
    webDataInfo.regionNext = data.regionNext ? data.regionNext : '';
} catch (e) {
    console.error(e)
}

// 输入区域选择
console.log('输入区域选择');
if (webDataInfo.regionType && webDataInfo.regionSelector) {
    let regionDomStr = await page.evaluate((regionSelector) => {
        let regionEle = document.querySelector(regionSelector)
        return regionEle.innerHTML
    }, webDataInfo.regionSelector)
    // 分析选项可输入的内容
    res = await getReginCompelite(regionDomStr);
    let regionData = []
    try {
        regionData = (JSON.parse(res.content.toString())).data;
    } catch (e) {
        console.error('regionData is not json');
        console.error(e);
    }
    console.log(regionData)
    for (let i = 0; i < regionData.length; i++) {
        console.log(regionData[i]);
        let item = regionData[i];
        try {
            let dataDomStr = await page.evaluate(async (item, infoSelector) => {
                let regionEle = document.querySelector('#dropdown');
                (regionEle.querySelector(`option[value="${item}"]`) as HTMLOptionElement).selected = true;
                let evt = new Event("change", { bubbles: true, cancelable: false });
                regionEle.dispatchEvent(evt);
                await new Promise((resolve) => { setTimeout(resolve, 1000) })
                let dataDom = document.querySelector(infoSelector);
                return domEleFilter(dataDom.cloneNode(true), ['script', 'style', 'svg']).innerHTML
            }, item, webDataInfo.infoSelector)
            if (dataDomStr !== '') {
                console.log('获取数据并保存数据')
                res = (await getTableCompelite(dataDomStr, dataDesc, item))
                let csvData = res.content.toString()
                console.log('保存数据');
                saveCSVToFileNode(csvData, path.join(__dirname, `../data/data_${item}.csv`))
            } else {
                console.error('dataDomStr is empty')
            }
        } catch (e) {
            console.error('getTableCompelite error', item);
            console.error(e)
        }
    }
}


// 关闭浏览器
await browser.close();