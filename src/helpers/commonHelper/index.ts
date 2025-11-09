import * as fs from 'fs';
import * as path from 'path';// 删除dom元素中的指定标签

function domEleFilter(dom, tagNames) {
    if (!Array.isArray(tagNames)) {
        tagNames = [tagNames];
    }
    console.log('11111')
    console.log(dom.getElementsByTagName)
    tagNames.forEach((tag) => {
        // 获取所有的script元素
        let tagNodes = dom.getElementsByTagName(tag);
        // 遍历并删除这些元素
        for (var i = tagNodes.length - 1; i >= 0; i--) {
            tagNodes[i].parentNode.removeChild(tagNodes[i]);
        }
    })
    return dom.innerHTML;
}

function simplifyDOMString(htmlStr) {
    // 移除 script 标签
    htmlStr = htmlStr.replace(/<script[^>]*>[\s\S]*<\/script>/gi, '');
    // 移除 style 标签
    htmlStr = htmlStr.replace(/<style[^>]*>[\s\S]*<\/style>/gi, '');
    return htmlStr;
}

function saveCSVToFileNode(csvString: string, filePath: string): void {
    // 使用fs模块的writeFile方法来保存文件
    if (fs.existsSync(filePath)) {
        let csvLines = csvString.split('\n');
        if (csvLines.length > 1) {
            csvString = csvLines.slice(1).join('\n');
        } else {
            csvString = '';
        }
        fs.appendFileSync(filePath, '\n' + csvString)
    } else {
        fs.writeFile(filePath, csvString, (err) => {
            if (err) {
                console.error('保存CSV文件时发生错误:', err);
            } else {
                console.log(`文件已保存到路径：${filePath}`);
            }
        });
    }
}

async function sleep(during: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, during);
    });
}


function createDictFromCSVs(folderPath: string): Record<string,any

function organizeDataFiles(folderPath: string): Record<string, any[]> {
    const dictionary: Record<string, any[]> = {};
    fs.readdirSync(folderPath).forEach((file) => {
      if (file.endsWith('.csv')) {
        const filePath = path.join(folderPath, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const lines = fileContent.split('\n');
  
        if (lines.length > 0) {
          const headers = lines[0].split(',');
          headers.forEach((header) => {
            dictionary[header] = [];
          });
        }
      }
    });
  
    return dictionary;
  }

export {
    domEleFilter,
    simplifyDOMString,
    saveCSVToFileNode,
    sleep
}