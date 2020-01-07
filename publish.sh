#!/bin/bash

REACT_NAME=use-dura
TARO_NAME=taro-use-dura

# 发布管理端使用的版本
npm run build:react || exit 1
sed -i "" "s|\(\"name\": \"\)[^\",]*|\1$REACT_NAME|g" package.json
npm publish || exit 1

# 发布客户端端使用的版本
npm run build:taro || exit 1
sed -i "" "s|\(\"name\": \"\)[^\",]*|\1$TARO_NAME|g" package.json
npm publish || exit 1

