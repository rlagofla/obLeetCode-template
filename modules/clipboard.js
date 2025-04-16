import clipboardy from "clipboardy"

import { fetchLeetCode, generateMarkdown } from "./utils.js"


export const pipeIntoClipboard = async (url, dir) => {
    const info = await fetchLeetCode(url)
    console.log(info)

    const markdownContent = await generateMarkdown(info)
    
    clipboardy.writeSync(markdownContent);
    console.log("✅ 已复制到剪贴板");
}