## 任务
evo_v11_001: 创建 UserDataManager 服务类 + 添加 browserAgent.userDataDir 配置 schema

## 假设
创建一个 UserDataManager 类，提供 init()（幂等创建目录结构）、getPath()（路径拼接）、readJSON()（类型安全 JSON 读取）、writeJSON()（JSON 写入）方法，并在 package.json 中添加 browserAgent.userDataDir 配置项。

## 执行内容摘要
- 创建了 `packages/vscode-ext/src/user-data-manager.ts`
  - UserDataManager 类：rootDir 来自配置，支持 ~ 展开
  - init()：幂等创建根目录及 skills/config/sessions 子目录
  - getPath(...segments)：返回数据根目录下的绝对路径
  - getRootDir()：返回数据根目录
  - readJSON<T>(...segments)：读取并解析 JSON，文件不存在返回 undefined
  - writeJSON<T>(data, ...segments)：序列化并写入 JSON，自动创建父目录
  - exists(...segments)：检查路径是否存在
  - onDidChangeRoot 事件：init() 成功后触发
  - dispose()：释放资源
  - 静态方法 getConfiguredDir() / resolveDir() 用于读取配置和路径解析
- 修改了 `packages/vscode-ext/package.json`
  - contributes.configuration.properties 新增 browserAgent.userDataDir（type: string, default: ~/.browser-agent）

## 验收命令输出
```
> vscode-ext@0.1.0 compile
> tsc -p ./tsconfig.json

PASS
```

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
