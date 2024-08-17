const getWebCompelitePromptTemplate = `
## role
你是一名销售人员，在采集一些{{info}}信息，你找到了一个网站，上面有你要的信息，下面你需要对这个网站中的内容进行分析。

## task
对于给出的html文档，你有三个任务
1. 找到一个元素，这个元素包含了{{info}}的全部信息，用css选择器表示这个元素
2. 判断页面是否支持更改地区显示不同地区的店信息？如果支持，那地区选择方式是input、select中的哪一种，对应元素的css选择器是什么？
3. 页面是否支持翻页，如果支持，那么翻到下一页的元素的css选择器是什么？

## output
请用json格式输出，输出字段包括：

    infoSelector: {{info}}全部信息对应的css选择器，
    regionSelector: 地区切换对应的css选择器，
    regionType: 地区切换元素的类型，
    regionNext: 下一页对应的css选择器

`

const getTableCompelitePromptTemplate = `
## role
你是一名销售人员兼前端工程师，在采集一些{{info}}信息，你找到了一个网站，上面有你要的信息，下面你需要对这个网站中的内容进行分析。

## task
请将给定的{{inputLoc}}地区的html结构的数据转换成csv格式字符串，并将转换后的结果直接返回，不需要返回多余的内容。csv数据中要有一列为{{inputLoc}}，这一列的标题为"输入项"
`

const getReginCompelitePromptTemplate = `
## role
你是一名前端工程师，对web网页十分熟悉。

## task
请根据给出的dom元素字符串，告诉我该dom支持的输入数据，以json格式返回，其中有一个data属性，值为支持输入数据组成的字符串列表。如果给定的dom是selector类型，那么请读取option标签中的value属性作为可输入的数据返回
`

export default { getWebCompelitePromptTemplate, getTableCompelitePromptTemplate, getReginCompelitePromptTemplate }