import fs from "fs";
import path from "path";
import open from 'open';

import { fetchLeetCode, generateMarkdown } from "./utils.js"

async function openObsidianLink(vault, filePath) {
    const encodedUri = `obsidian://open?vault=${encodeURIComponent(vault)}&file=${encodeURIComponent(filePath)}`;
    // console.log(encodedUri)
    await open(encodedUri);
}

export const createMd = async (url, dir) => {
    const info = await fetchLeetCode(url)

    const markdownContent = await generateMarkdown(info)
    const filePath = path.join(dir, `${info.titleCn}.md`);

    fs.writeFileSync(filePath, markdownContent, "utf-8");

    console.log(`✅ 已生成笔记`);

    // await openObsidianLink("算法", `repo/${info.titleCn}.md`);
}