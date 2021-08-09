<template>
  <div class="scenic-closed">
    <div class="filter">
      <h2>任务列表</h2>
      <div class="filter-wrap">
        <div class="filter-item"><label> 任务id：</label><Input v-model="taskId" placeholder="请输入任务id" /></div>
        <div class="filter-item hide-icon">
          <label> 景区：</label>
          <Select v-model="poiId" :filterable="true" :remote="true" :remote-method="getPois" :debounce="500" clearable placeholder="请输入poi_id/名称" :popper-class="poiPoperClass">
            <Option v-for="poi in poiList" :key="poi.poiId" :value="poi.poiId" :label="`${poi.poiName}(${poi.poiId})`" />
          </Select>
        </div>
        <div class="filter-item hide-icon">
          <label> 提交人：</label>
          <Select v-model="bdId" :filterable="true" :remote="true" :remote-method="getBd" :debounce="500" clearable placeholder="请输入提交人姓名" :popper-class="bdPoperClass">
            <Option v-for="bd in bdList" :key="bd.id" :value="bd.id" :label="`${bd.bdName}(${bd.id})`" />
          </Select>
        </div>
        <div class="filter-item">
          <label>任务类型：</label>
          <Select v-model="taskType">
            <Option v-for="key in Object.keys(mapping.taskTypeMap)" :key="key" :value="key" :label="mapping.taskTypeMap[key]" />
          </Select>
        </div>
        <div class="filter-item">
          <label>任务状态：</label>
          <Select v-model="taskStatus">
            <Option v-for="key in Object.keys(mapping.taskStatusMap)" :key="key" :value="key" :label="mapping.taskStatusMap[key]" />
          </Select>
        </div>
        <div class="filter-item">
          <label>提交日期：</label>
          <DatePicker type="date" placeholder="选择时间" v-model="submitDate" value-format="yyyy-MM-dd"></DatePicker>
        </div>
        <div class="filter-item">
          <Button type="primary" @click="getList">查询</Button>
          <Button type="text-primary" @click="reset">重置</Button>
        </div>
      </div>
    </div>
    <div class="action">
      <div>
        <Button type="warning" @click="createClosedTask" v-if="role === 1 || role === 2 || role === 3">+添加闭园信息</Button>
        <!-- <Button type="warning">+添加开园信息</Button> -->
      </div>
      <div>
        <Button @click="exportData">导出</Button>
      </div>
    </div>
    <div class="list">
      <Loading :loading="loading" :delay="200">
        <Table :data="tableData">
          <TableColumn label="任务id" prop="taskId"></TableColumn>
          <TableColumn label="任务类型" prop="taskType">
            <span slot-scope="scope">
              {{ mapping.taskTypeMap[scope.row.taskType] }}
            </span>
          </TableColumn>
          <TableColumn label="景区" width="200">
            <div slot-scope="scope" v-if="scope.row.pois">
              <div v-if="scope.row.pois.length < 4">
                <div class="poi-info" v-for="item in scope.row.pois" :key="item.poiId">{{ item.poiName === 'null' ? item.poiId : item.poiName + '(' + item.poiId + ')' }};</div>
              </div>
              <div v-else>
                <template v-for="(item, index) in scope.row.pois">
                  <div class="poi-info" v-if="index < 2" :key="item.poiId">{{ item.poiName === 'null' ? item.poiId : item.poiName + '(' + item.poiId + ')' }};</div>
                </template>
                <Popover>
                  <Button size="small">查看全部</Button>
                  <div slot="content">
                    <div class="poi-info" v-for="item in scope.row.pois" :key="item.poiId">{{ item.poiName === 'null' ? item.poiId : item.poiName + '(' + item.poiId + ')' }};</div>
                  </div>
                </Popover>
              </div>
            </div>
          </TableColumn>
          <TableColumn label="提交人">
            <div slot-scope="scope" style="text-align: center">
              <span v-if="!scope.row.taskBd">-</span>
              <span v-else>
                <span>{{ scope.row.taskBd.bdName }}</span
                ><br /><span>{{ scope.row.taskBd.bdMis }}</span>
              </span>
            </div>
          </TableColumn>
          <TableColumn label="提交时间" prop="submitTime"></TableColumn>
          <TableColumn label="审核人">
            <div slot-scope="scope" style="text-align: center">
              <template v-if="scope.row.taskAuditor">
                <span>{{ scope.row.taskAuditor.bdName }}</span
                ><br /><span>{{ scope.row.taskAuditor.bdMis }}</span
                ><br />
                <span class="link" @click="showHandleModal(scope.row.taskId)" v-if="scope.row.taskStatus > 1">查看审核进度</span>
              </template>
              <span v-else> - </span>
            </div>
          </TableColumn>
          <TableColumn label="状态" prop="taskStatus">
            <span slot-scope="scope">
              {{ mapping.taskStatusMap[scope.row.taskStatus] }}
            </span>
          </TableColumn>
          <TableColumn label="操作">
            <div slot-scope="scope" v-if="scope.row.taskBd">
              <router-link
                class="action-link link"
                :to="{ name: 'closedTaskModify', params: { id: scope.row.taskId } }"
                v-if="scope.row.taskBd.bdMis === bdMis && [1, 4].includes(scope.row.taskStatus)"
                >编辑</router-link
              >
              <router-link v-if="scope.row.showAnnouncementProcessBtn" class="action-link link" :to="{ name: 'closedTaskHandle', params: { id: scope.row.taskId } }">公告处理</router-link>
              <router-link v-if="scope.row.taskBd.bdMis === bdMis || scope.row.taskStatus !== 1" class="action-link link" :to="{ name: 'closedTaskDetail', params: { id: scope.row.taskId } }"
                >查看详情</router-link
              >
              <span v-if="[5, 6].includes(scope.row.taskStatus)" class="action-link link" @click="showResult(scope.row.taskId)">处理结果</span>
            </div>
          </TableColumn>
        </Table>
      </Loading>
      <div style="float: right; margin-top: 20px;">
        <Pagination :current-page.sync="pageNo" :page-size="pageSize" :total="totalCount" @change="getList"></Pagination>
      </div>
    </div>
    <resultModal v-model="isModalShow" :taskid="targetId"></resultModal>
    <handleModal v-model="isHandleShow" :taskid="targetId"></handleModal>
  </div>
</template>

<script>
import { Button, Input, Select, Option, DatePicker, Table, Pagination, TableColumn, Popover, Loading } from '@ss/mtd-vue'
import resultModal from './result-modal'
import handleModal from './handle-modal'
import mapping from '../lib/config'
import api from '../api'
export default {
  data() {
    return {
      loading: true,
      mapping: mapping,
      taskId: '',
      poiId: '',
      poiName: '',
      bdId: '',
      taskType: '',
      taskStatus: '',
      submitDate: '',
      tableData: [],
      poiList: [],
      bdList: [],
      role: -1,
      pageNo: 1,
      pageCount: 1,
      pageSize: 10,
      totalCount: 0,
      isModalShow: false,
      isHandleShow: false,
      targetId: '',
      bdMis: '',
      bdPoperClass: 'select-poper-hide',
      poiPoperClass: 'select-poper-hide',
    }
  },
  watch: {
    poiList() {
      if (this.poiList.length) {
        this.poiPoperClass = 'select-poper-show'
      } else {
        this.poiPoperClass = 'select-poper-hide'
      }
    },
    bdList() {
      if (this.bdList.length) {
        this.bdPoperClass = 'select-poper-show'
      } else {
        this.bdPoperClass = 'select-poper-hide'
      }
    },
  },
  components: {
    Button,
    Input,
    Select,
    Option,
    DatePicker,
    Table,
    Pagination,
    TableColumn,
    Popover,
    Loading,
    resultModal,
    handleModal,
  },
  methods: {
    async getPois(keyword) {
      if (keyword) {
        this.poiList = await api.getPois({ keyword })
      } else {
        this.poiList = []
      }
    },
    async getBd(keyword) {
      if (keyword) {
        this.bdList = await api.getBdOrg({ keyword, orgId: '' })
      } else {
        this.bdList = []
      }
    },
    async exportData() {
      const obj = {
        taskId: this.taskId,
        poiId: this.poiId,
        bdId: this.bdId,
        taskType: this.taskType,
        taskStatus: this.taskStatus,
        submitDate: this.submitDate,
      }
      let params = {}
      for (let key in obj) {
        if (obj[key] !== null) {
          params[key] = obj[key]
        }
      }
      try {
        await api.exportListData()
      } catch (e) {
        this.$mtd.confirm({
          title: '异常',
          message: '数据导出失败',
          type: 'warning',
        })
        throw e
      }
      this.$mtd.message({
        type: 'success',
        message: '导出成功，excel下载链接将通过大象发送',
      })
    },
    reset() {
      this.taskId = ''
      this.poiId = ''
      this.bdId = ''
      this.taskType = ''
      this.taskStatus = ''
      this.submitDate = ''
      this.pageNo = 1
    },
    async getList() {
      const obj = {
        taskId: this.taskId,
        poiId: this.poiId,
        bdId: this.bdId,
        taskType: this.taskType,
        taskStatus: this.taskStatus,
        submitDate: this.submitDate,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      }
      let params = {}
      for (let key in obj) {
        if (obj[key]) {
          params[key] = obj[key]
        }
      }
      this.loading = true
      try {
        let { dataList, totalCount, pageCount, pageSize } = await api.getTaskList(params)
        this.loading = false
        this.tableData = dataList
        this.pageSize = pageSize
        this.pageCount = pageCount
        this.totalCount = totalCount
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    createClosedTask() {
      this.$router.push({ name: 'closedTaskCreate' })
    },
    showResult(id) {
      this.targetId = id
      this.isModalShow = true
    },
    showHandleModal(id) {
      this.targetId = id
      this.isHandleShow = true
    },
  },
  async created() {
    let { bdId, role, bdMis } = await api.getRole()
    this.role = role
    this.bdMis = bdMis
    this.getList()
  },
}
</script>
<style lang="scss" scoped>
.filter {
  .filter-wrap {
    display: flex;
    flex-wrap: wrap;
  }
  .filter-item {
    margin-right: 25px;
    margin-bottom: 20px;
  }
  >>> .mtd-select {
    vertical-align: middle;
  }
  >>> hide-icon .mtdicon-down-thick {
    display: none;
  }
}
.action {
  display: flex;
  justify-content: space-between;
}
.list {
  margin-top: 20px;
  >>> .mtd-table-cell {
    text-align: center;
  }
  .link {
    color: #0a70f5;
    cursor: pointer;
  }
  .link:hover {
    color: #2a8efe;
    text-decoration: underline;
  }
  .action-link {
    display: block;
  }
}
</style>
<style lang="scss">
.select-poper-show {
  display: block;
}
.select-poper-hide {
  display: none;
}
</style>
