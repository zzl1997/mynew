<template>
  <div>
    <h1>国际化字典表小工具</h1>
    <div style="margin: 10px" id="box" v-for="(item, index) in dict" :key="item.index">
      <el-input class="item" v-model="item.input_en" placeholder="请输入英文名称"></el-input>
      <el-input class="item" v-model="item.input_zh" placeholder="请输入中文文字段" required></el-input>
      <el-input class="item" v-model="item.input_key" placeholder="转换后的英文字段"></el-input>
      <el-button @click="deleteItem(index)" style="margin-left: 40px" type="danger" icon="el-icon-delete"
                 circle></el-button>
    </div>
    <div style="margin-top: 40px;">
      <el-button @click="add" type="primary">增加</el-button>
      <el-button @click="genarate" type="success">生成</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "addTranslation",
  data() {
    return {
      dict: [
        {
          input_en: '',
          input_zh: '',
          input_key: ''
        },
      ]
    }
  }
  ,
  methods: {
    add() {
      this.dict.push({
        input_en: '',
        input_zh: '',
        input_key: ''
      })
    },
    deleteItem(index) {
      console.log(index)
      this.dict.splice(index, 1)
    },
    genarate() {
      let a = {}
      for (let item of this.dict) {
        a[item.input_key] = {
          en: item.input_en,
          zh: item.input_zh
        }
      }

      let data = (JSON.stringify(a,null,'\t'))
      a = document.createElement('a')
      let blob = new Blob([data], {type: 'text/json'});
      let objectUrl = URL.createObjectURL(blob);
      a.setAttribute("href", objectUrl);
      a.setAttribute("download", 'translate.json');
      a.click();
    }

  }
  ,
  watch: {
    dict: {
      handler(arr) {
        // console.log(arr)
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].input_en) {
            let a = arr[i].input_en.trim().split(/[\s]+/).map((item, index) => {
              if (index === 0) {
                return (item[0].toLowerCase() + item.slice(1).toLowerCase()).replace(/[\W]+/, "_")
              } else {
                return (item[0].toUpperCase() + item.slice(1).toLowerCase()).replace(/[\W]+/, "_")
              }
            }).join("")
            arr[i].input_key = a
          }


        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>
#box {
  display: flex;
  justify-content: center;;

}
.item {
  width: 20%;
}
</style>
