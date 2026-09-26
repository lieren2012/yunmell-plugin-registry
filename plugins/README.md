# 插件条目

每个插件使用一个 JSON 文件，文件名建议与 `id` 一致，例如：

```json
{
  "id": "example.connector",
  "displayName": "Example Connector",
  "official": {
    "packageName": "@example/connector",
    "version": "1.2.3",
    "source": "https://github.com/example/connector",
    "license": "MIT",
    "commit": "<reviewed-commit>"
  },
  "yunmell": {
    "adapterVersion": "0.1.0",
    "status": "testing",
    "minAgentOsVersion": ">=0.3.0",
    "harnessFamily": "official-harness"
  },
  "artifacts": [],
  "governance": {
    "owner": "yunmell-platform",
    "notes": "提交前完成许可证、来源和安全审查"
  }
}
```

示例中的占位内容不能直接发布。新增条目后，要在根目录的 `registry.json` 增加索引，例如：

```json
{
  "id": "example.connector",
  "entry": "plugins/example.connector.json",
  "status": "testing"
}
```
