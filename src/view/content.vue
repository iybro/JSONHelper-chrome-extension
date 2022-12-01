<template>
  <el-row :gutter="10">
    <el-col :span="12">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
<!--          <span class="title">待解析字符</span>-->
          <el-link type="primary" class="title">Inputs</el-link>
          <el-button type="primary" icon="el-icon-s-promotion" circle style="float: right; " size="small" @click="parse"></el-button>
        </div>
        <div class="text item">
          <el-row type="flex" justify="left">
            <el-col :span="12">
              <div class="sub-title">examples:</div>
              <el-select v-model="req.expression" placeholder="expression" @change="parse">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="12">
              <div class="sub-title">expression:</div><el-input placeholder="expression" v-model="req.expression" @keyup.enter="parse">
              </el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-input
                type="textarea"
                :rows="25"
                placeholder="please input your json content"
                v-model="req.content">
            </el-input>
          </el-row>
        </div>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-link type="primary" class="title">Evaluation Results</el-link>&nbsp;&nbsp;&nbsp;&nbsp;<el-link type="info">{{ dataType }}</el-link>
          <el-button type="success" icon="el-icon-circle-check" circle style="float: right; " v-if="status" size="small"></el-button>
          <el-button type="danger" icon="el-icon-circle-close" circle style="float: right;"  v-if="!status" size="small"></el-button>
        </div>
        <pre v-html="formattedJSON"></pre>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import axios from "axios";
/*import {JSONPath} from "jsonpath-plus";*/

export default {
  name: 'contentView',
  data() {
    return {
      options: [{
        value: '$',
        label: 'Origin data'
      }, {
        value: '$.store.book[*].author',
        label: 'The authors of all books'
      }, {
        value: '$.store.book[*].price',
        label: 'The prices of all books'
      }, {
        value: '$.store.book[-1].price',
        label: 'Price of last book'
      }, {
        value: '$.store.book[?(@.price < 20)]',
        label: 'All books in store cheaper than 10'
      },{
          value: '$..book[?(@.isbn)]',
          label: 'All books with an ISBN number'
        },
        {
          value: '$.store.book.length()',
          label: 'The number of books'
        },
        {
          value: '$..book[*].price.min()',
          label: 'lowest Price'
        },


      ],
      value: '',
      status: true,
      msg: 'content',
      parsed: "Can't extract any data",
      formattedJSON: "Extracted data",
      dataType: "",
      req: {
        content: "{\n" +
            "    \"store\": {\n" +
            "        \"book\": [\n" +
            "            {\n" +
            "                \"category\": \"reference\",\n" +
            "                \"author\": \"Nigel Rees\",\n" +
            "                \"title\": \"Sayings of the Century\",\n" +
            "                \"price\": 8.95\n" +
            "            },\n" +
            "            {\n" +
            "                \"category\": \"fiction\",\n" +
            "                \"author\": \"Evelyn Waugh\",\n" +
            "                \"title\": \"Sword of Honour\",\n" +
            "                \"price\": 12.99\n" +
            "            },\n" +
            "            {\n" +
            "                \"category\": \"fiction\",\n" +
            "                \"author\": \"Herman Melville\",\n" +
            "                \"title\": \"Moby Dick\",\n" +
            "                \"isbn\": \"0-553-21311-3\",\n" +
            "                \"price\": 8.99\n" +
            "            },\n" +
            "            {\n" +
            "                \"category\": \"fiction\",\n" +
            "                \"author\": \"J. R. R. Tolkien\",\n" +
            "                \"title\": \"The Lord of the Rings\",\n" +
            "                \"isbn\": \"0-395-19395-8\",\n" +
            "                \"price\": 22.99\n" +
            "            }\n" +
            "        ],\n" +
            "        \"bicycle\": {\n" +
            "            \"color\": \"red\",\n" +
            "            \"price\": 19.95\n" +
            "        }\n" +
            "    },\n" +
            "    \"expensive\": 10\n" +
            "}",
        expression: "$"
      }
    }
  },
  created() {
    this.parse()
  },
  methods: {
    parse() {
      this.parsed = "hello";
      axios.post('http://tools.bettery.top/api/json/parse', this.req).then(res => {
        if(res.data.code !== 1){this.status = false}
        this.parsed = JSON.stringify(res.data.data.content, null, 1);
        this.dataType = res.data.data.dataType
        this.formattedJSON = this.syntaxHighlight(res.data.data.content);
      });
      // const json = JSON.parse(this.req.content)
      // const result = JSONPath({path: this.req.expression, json});
      // const parsed = JSON.stringify(result)
      // console.log(parsed)
      // this.parsed = parsed
      // this.formattedJSON = this.syntaxHighlight(result);
    },
    test(content) {
      this.req.expression = content
      this.parse()
    },
    syntaxHighlight(json) {
      if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
      }
      json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
      return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'key';
          } else {
            cls = 'string';
          }
        } else if (/true|false/.test(match)) {
          cls = 'boolean';
        } else if (/null/.test(match)) {
          cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
      });
    }
  }
}

</script>

<style>
.title {
  font-size: 18px;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.box-card {
  width: 100%;
  padding: 2px;
}

.el-card__body, .el-main {
  padding: 20px;
  height: 670px;
}


.el-row {
  margin-bottom: 20px;

&
:last-child {
  margin-bottom: 0;
}

}
.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

pre {
  outline: 1px solid #ccc;
  padding: 2px;
  margin: 2px;
  height: 670px;
  font-size: 13px;
}

.string {
  color: green;
}

.number {
  color: darkorange;
}

.boolean {
  color: blue;
}

.null {
  color: magenta;
}

.key {
  color: red;
}


</style>
