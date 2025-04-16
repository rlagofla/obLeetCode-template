import fs from "fs";
import path from "path";

import { fetchLeetCode, generateMarkdown } from "./utils.js"


export const createMd = async (url, dir) => {
    const info = await fetchLeetCode(url)

    const markdownContent = await generateMarkdown(info)
    const filePath = path.join(dir, `${info.titleCn}.md`);

    fs.writeFileSync(filePath, markdownContent, "utf-8");

    console.log(`✅ 已生成笔记`);
}