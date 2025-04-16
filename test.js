import fetch from 'node-fetch';
import fs from 'fs';  // 引入 fs 模块来写入文件

const url = 'https://leetcode.cn/graphql/';
const headers = {
    'Accept': '*/*',
    'Accept-Language': 'zh,en-US;q=0.9,en;q=0.8,zh-CN;q=0.7',
    'Connection': 'keep-alive',
    'Cookie': 'aliyungf_tc=a60b9d86e5f7c0f85ff19c05dd8e6c26a1b0dd2782bfc03daee91675a50c25cd; _bl_uid=ULmy65L9ne0xwvo4R25qkmeoezst; __appToken__=; csrftoken=GzKXKQCNGQVp99toxtobP3RAKCgS1FGx2s3QJdSH3sOV7xALmSSpgHjdXyZYzJyo; sl-session=g3iaCzg5xWeUPovViI/bTQ==; LEETCODE_SESSION=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfYXV0aF91c2VyX2lkIjoiMzgwMTgyNiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNWM2YTJlOWY4NWQwNDY0NmQzNzYzOTAxNTU2Yzk3NzUzYzZjMTJkZjRlNTQwZWI5MzU5YTNhNzEyNzk5ZmJmZSIsImlkIjozODAxODI2LCJlbWFpbCI6IiIsInVzZXJuYW1lIjoiZnVubnktamVubmluZ3NiZGkiLCJ1c2VyX3NsdWciOiJmdW5ueS1qZW5uaW5nc2JkaSIsImF2YXRhciI6Imh0dHBzOi8vYXNzZXRzLmxlZXRjb2RlLmNuL2FsaXl1bi1sYy11cGxvYWQvZGVmYXVsdF9hdmF0YXIucG5nIiwicGhvbmVfdmVyaWZpZWQiOnRydWUsImRldmljZV9pZCI6IjRjYWFjMzM0MTdkYWQ0ZWVmMDMzZjhhNjc2ZDM1YjkzIiwiaXAiOiIxMTIuNjUuNzkuMjI4IiwiX3RpbWVzdGFtcCI6MTc0MDA5MjU1My40MjYyNTg4LCJleHBpcmVkX3RpbWVfIjoxNzQyNjcwMDAwLCJ2ZXJzaW9uX2tleV8iOjAsImxhdGVzdF90aW1lc3RhbXBfIjoxNzQwODM1OTU1fQ.GIaKevhFJwB3HZP5_SRlb2wQug-KFAnEJR1Yljve4dE',
    'DNT': '1',
    'Origin': 'https://leetcode.cn',
    'Referer': 'https://leetcode.cn/problemset/all-code-essentials/',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
    'Content-Type': 'application/json',
    'x-csrftoken': 'GzKXKQCNGQVp99toxtobP3RAKCgS1FGx2s3QJdSH3sOV7xALmSSpgHjdXyZYzJyo'
};

const body = JSON.stringify({
    query: `
        query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
            problemsetQuestionList(
                categorySlug: $categorySlug,
                limit: $limit,
                skip: $skip,
                filters: $filters
            ) {
                hasMore
                total
                questions {
                    acRate
                    difficulty
                    freqBar
                    frontendQuestionId
                    isFavor
                    paidOnly
                    solutionNum
                    status
                    title
                    titleCn
                    titleSlug
                    topicTags {
                        name
                        nameTranslated
                        id
                        slug
                    }
                    extra {
                        hasVideoSolution
                        topCompanyTags {
                            imgUrl
                            slug
                            numSubscribed
                        }
                    }
                }
            }
        }
    `,
    variables: {
        categorySlug: "all-code-essentials",
        skip: 0,
        limit: 50,  // 每次请求50条记录
        filters: {}
    },
    operationName: "problemsetQuestionList"
}, null, 4);

async function fetchData(skip = 0) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                ...JSON.parse(body),
                variables: {
                    ...JSON.parse(body).variables,
                    skip: skip
                }
            })
        });
        const data = await response.json();
        return data.data.problemsetQuestionList;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function fetchAllQuestions() {
    let allQuestions = [];
    let hasMore = true;
    let skip = 0;

    while (hasMore) {
        const { questions, hasMore: hasMoreData } = await fetchData(skip);
        allQuestions = allQuestions.concat(questions);
        hasMore = hasMoreData;
        skip += 50;  // 每次请求50条记录，更新skip
    }

    return allQuestions;
}

const allData = await fetchAllQuestions();
const filteredData = allData.map(d => { 
    return { titleCn: d.titleCn, titleSlug: d.titleSlug, paidOnly: d.paidOnly }
})
// console.log(filteredData)

fs.writeFileSync('questions.json', JSON.stringify(filteredData, null, 4));