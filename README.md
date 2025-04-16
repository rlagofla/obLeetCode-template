# ⚠️ 温馨提示

建议运行前先备份，没做什么错误管理，要是出啥问题我也不知道怎么回退

# 上手就用

1. 配置好 [Node.js](https://nodejs.org/zh-cn) 环境，在这个脚本所在目录下 `npm i`
2. 去 Obsidian 下载 [Shell commands](https://github.com/Taitava/obsidian-shellcommands)
3. 去设置中加入下面两条命令

```shell
cd <这个脚本所在目录> && node index.js create -u {{clipboard}} -d '<生成文件的目录>'
```

那个 `{{clipboard}}` 是 [Shell commands](https://github.com/Taitava/obsidian-shellcommands) 的参数，表示从剪贴板中获取

```shell
cd <这个脚本所在目录> && node index.js clipboard -u {{clipboard}}
```

这条命令会把模版添加到文件夹

之后就去做 [LeetCode](https://leetcode.cn/) 吧，把 url 复制了，绑定快捷键调用也行，`ctrl+P` 调用也行就生成啦