# Yunmell Plugin Registry

云迈统一插件中心的官方插件版本、云迈适配版本和发布状态登记库。

这个仓库负责记录“对应关系”和“治理状态”，不直接保存插件运行时密钥，也不默认托管大型二进制包。插件中心可以读取 `registry.json`，再根据条目中的来源、版本和校验值获取插件。

## 解决的问题

- 官方插件包、官方版本和来源是什么；
- 云迈适配层对应哪个官方版本；
- 哪个版本已经测试、发布、弃用或阻断；
- 插件需要的云迈 Agent OS、桌面端或 Harness 版本；
- 插件包的许可证、摘要和完整性校验值；
- 谁负责维护，什么时候复核。

## 目录

```text
registry.json                 当前登记目录
schema/                       JSON Schema
plugins/                      插件条目，一个插件一个 JSON 文件
docs/version-governance.md    版本对应和发布治理规则
scripts/validate.mjs          本地和 CI 校验脚本
.github/workflows/validate.yml
```

## 当前状态

这是第一版登记库骨架，暂不把未完成的插件写成可发布条目。新增插件时，先在 `plugins/` 增加完整条目，再在 `registry.json` 增加对应的 `id`、`entry` 和 `status` 索引，最后通过 Pull Request 进入统一插件中心。

## 本地校验

```powershell
node scripts/validate.mjs
```

## 许可证

仓库本身的许可证策略待云迈产品发布策略确定。每个插件必须单独登记其上游许可证和发布限制，不能因为本仓库可访问就视为插件已经获得商业发布许可。
