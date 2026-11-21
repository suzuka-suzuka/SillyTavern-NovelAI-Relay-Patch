# SillyTavern NovelAI 绘图 URL 补丁

为 SillyTavern 1.19.1 的「图像生成 → NovelAI Diffusion」增加 **第三方 API URL** 输入框。地址留空时使用官方接口。绘图、放大和「查看我的 Anlas」使用填写的 URL，继续沿用酒馆原有的 NovelAI 密钥管理和配图入口。

模型下拉框新增 **NAI Diffusion V5 (Full)** 和 **NAI Diffusion V5 (Curated)**。使用 Relay 时，V5 的体力和点数按密钥套餐结算。

## 安装或更新

本补丁已在 [SillyTavern 1.19.1](https://github.com/SillyTavern/SillyTavern/tree/1.19.1) 验证。首次安装和旧版更新使用同一套命令。在酒馆根目录（有 `server.js` 的文件夹）打开终端，逐行执行。脚本会检查源码并自动应用最新版，完成后重启酒馆并刷新浏览器。

```powershell
curl.exe -fL https://raw.githubusercontent.com/suzuka-suzuka/SillyTavern-NovelAI-Relay-Patch/main/install.mjs -o .nai-relay-install.mjs
node .nai-relay-install.mjs
```

macOS 和 Linux 将第一行的 `curl.exe` 换成 `curl`。

## 使用

1. 重启酒馆并刷新浏览器。
2. 打开 **扩展 → 图像生成**，来源选 **NovelAI Diffusion**。
3. 在 **第三方 API URL** 填写 Relay 根地址。Relay 和酒馆在同一台电脑且 Relay 使用默认端口时，填写 `http://127.0.0.1:3100`。
4. 在 **API 连接 → NovelAI → 管理 API 密钥** 保存 Relay 密钥，再回到图像生成设置点击 **查看我的 Anlas**。
5. 在 **模型** 下拉框选择所需模型。使用仅包含 V4.5 小图权益的密钥时，选择 V4.5。

可以照常使用酒馆的魔杖、自动配图和 `/imagine`。例如，下面的命令会直接使用输入的提示词出图。

```text
/imagine extend=false cherry blossoms, blue sky
```

## 撤销补丁

升级酒馆本体前，如需还原源码，在酒馆根目录运行下面这条命令。

```sh
node .nai-relay-install.mjs --remove
```

## 许可证

补丁随附上游的 [AGPL-3.0 许可证](LICENSE)。
