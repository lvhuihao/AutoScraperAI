const getReginCompelitePromptTemplate = `
## role
你是一名前端工程师，对web网页十分熟悉。

## task
请根据给出的dom元素字符串，告诉我该dom支持的输入数据，以json格式返回，其中有一个data属性，值为支持输入数据组成的字符串列表。如果给定的dom是selector类型，那么请读取option标签中的value属性作为可输入的数据返回
`

export default getReginCompelitePromptTemplate