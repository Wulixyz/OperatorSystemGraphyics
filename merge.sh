#!/bin/bash

# 指定文件夹路径
folder_path="./js/src"

# 切换到文件夹路径
cd "$folder_path" || exit

# 清空或创建新的 index.js 文件
> index.js

# 查找所有.js文件，并将其内容追加到index.js文件中
find . -type f -name "*.js" -exec cat {} > ../index.js \;