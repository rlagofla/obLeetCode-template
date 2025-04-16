import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import clipboardy from "clipboardy";

export const getDate = () => new Date().toISOString().split("T")[0];

export function extractTitleSlug(url) {
    const match = url.match(/problems\/([^\/]+)/);
    return match ? match[1] : null;
}

export async function fetchLeetCode(problemUrl) {
    const slug = extractTitleSlug(problemUrl)

    const quertUrl = "https://leetcode.cn/graphql/";

    const headers = {
        "Accept": "*/*",
        "Accept-Language": "zh,en-US;q=0.9,en;q=0.8,zh-CN;q=0.7",
        "content-type": "application/json"
    };

    const body = JSON.stringify({
        query: `{
            question(titleSlug: "${slug}") {
                questionId
                frontendQuestionId: questionFrontendId
                difficulty
                title
                titleCn: translatedTitle
                titleSlug
                content
                paidOnly: isPaidOnly
                topicTags {
                    name
                    translatedName
                }
            }
        }`
    });

    try {
        const response = await fetch(quertUrl, {
            method: "POST",
            headers: headers,
            body: body,
        });

        const data = await response.json();
        console.log(data)
        const info = data.data.question
        if (!info) {
            console.error("❌ 无法获取题目信息！");
            process.exit(1)
        }
        /////////////////////
        const tags = info.topicTags.map((t) => t.translatedName).join(", ");
        // const date = getDate();
        const url = `https://leetcode.cn/problems/${slug}/`;
    
        info.tags = tags;
        info.url = url;
        info.slug = slug;
        // info.created = getDate()

        return info
    } catch (error) {
        console.error("❌ 请求失败:", error);
    }
}

export async function generateMarkdown(info) {
    let template = fs.readFileSync('template.md', 'utf8');

    // 替换模板变量
    for (let key in info) {
        template = template.replace(new RegExp(`{{${key}}}`, 'g'), info[key]);
    }

    return template;
}