const getTableCompelitePromptTemplate = `
## role
你是一名销售人员兼前端工程师，在采集一些{{info}}信息，你找到了一个网站，上面有你要的信息，下面你需要对这个网站中的内容进行分析。

## task
请将给定的{{inputLoc}}地区的html结构的数据转换成csv格式字符串，并将转换后的结果直接返回，不需要返回多余的内容。

## output example
State,city,position,detail_position1,detail_position2,detail_position3,phone,website
Alberta,Calgary,Chinook Centre,6455 Macleod Trail SW,Calgary, AB T2H 0K8,(403) 444-3759,/ca/retail/chinookcentre/
Alberta,Calgary,Market Mall,3625 Shaganappi Trail NW,Calgary, AB T3A 0E2,(403) 648-4865,/ca/retail/marketmall/
Alberta,Edmonton,West Edmonton,8882-170 Street,Edmonton, AB T5T 4M2,(780) 701-0540,/ca/retail/westedmonton/
Alberta,Edmonton,Southgate Centre,5015 111 St,Edmonton, AB T6H 4M6,(780) 801-3820,/ca/retail/southgatecentre/
`

export default getTableCompelitePromptTemplate