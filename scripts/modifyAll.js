import fs from "fs";
import path from "path";

import { fetchLeetCode, generateMarkdown } from "../modules/utils.js";

// 获取当前脚本所在目录，或指定的目录
const folderPath = process.argv[2] || __dirname;

// 读取文件夹内所有文件（包括子目录）
function listFiles(dir) {
    let results = [];
    try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                results = results.concat(listFiles(filePath)); // 递归处理子目录
            } else {
                results.push(filePath); // 记录文件路径
            }
        }
    } catch (err) {
        console.error(`Error reading directory "${dir}":`, err);
    }
    return results;
}



const questions = JSON.parse(fs.readFileSync('questions.json', 'utf-8'));

const files = listFiles(folderPath).slice(1)
console.log(files)
// process.exit()

files.forEach(async filePath => {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    if(fileContent.split('\n')[0] !== '---') {
        const titleCn = filePath.split('/').at(-1).slice(0, -3)
        const titleSlug = questions.find(q => q.titleCn === titleCn).titleSlug;
        

        const info = await fetchLeetCode(`https://leetcode.cn/problems/${titleSlug}`)
        
        const markdownContent = await generateMarkdown(info)

        fs.writeFileSync(filePath, markdownContent + '\n\n' + fileContent)
    }

    // process.exit(1)
});

