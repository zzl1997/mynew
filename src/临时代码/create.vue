<template>
  <div class="closed-create">
    <h2>闭园任务</h2>
    <Form :label-width="120" :model="taskVo" ref="form">
      <FormItem label="任务id：" v-show="taskVo.taskId">
        <span>BY-{{ taskVo.taskId }}</span>
      </FormItem>
      <FormItem required label="提报人：">
        <Input v-model="taskVo.taskBd.bdMis" readonly style="width: 140px;" />
        <span class="item-label">所属区域：</span>
        <Input v-model="taskVo.bdRegion" readonly style="width:280px;" />
      </FormItem>
      <FormItem required label="闭园类型:" prop="closeType">
        <Select v-model="taskVo.closeType" style="width: 500px">
          <Option v-for="(item, key) in mapping.closedTypeMap" :key="key" :value="+key" :label="item" />
        </Select>
      </FormItem>
      <div v-if="isUrgentRole">
        <FormItem required label="批量添加闭园poi">
          <Textarea :autosize="{ minRows: 3, maxRows: 6 }" style="width: 500px;" v-model="taskVo.poiIds" placeholder="输入poiId列表" />
          <div class="warning-tips-urgent">
            <div>参数说明,输入poiId列表(英文逗号隔开)</div>
            <div>参数示例： 49473283,49473372</div>
            <div>最多上传500个poi（过多可能存在消息积压系统处理慢）</div>
          </div>
        </FormItem>
      </div>
      <div v-else>
        <FormItem label="添加闭园poi" helper="可按照城市检索，也可按照poi名称或ID检索">
          <span></span>
        </FormItem>
        <FormItem label="选择城市:" prop="cityId">
          <Select v-model="taskVo.cityId" clearable filterable remote :remote-method="getCities" :debounce="500" @change="cityChange">
            <Option :value="0" label="全部" />
            <Option v-for="city in cityList" :key="city.cityId" :value="city.cityId" :label="city.cityName" />
          </Select>
        </FormItem>
        <Loading :loading="loading">
          <FormItem required label="选择景区:" prop="pois">
            <Select v-model="taskVo.pois" style="width: 500px;" :filterable="true" :remote="true" :remote-method="getPois" :debounce="500" multiple clearable>
              <Option v-for="poi in poiList" :key="poi.poiId" :value="JSON.stringify(poi)" :label="`${poi.poiName}(${poi.poiId})`" />
            </Select>
          </FormItem>
        </Loading>
      </div>

      <FormItem required label="景区营业状态:" prop="poiStatus" helper="审核通过后，所选poi营业状态将变为暂停营业">
        <Select v-model="taskVo.poiStatus" disabled>
          <Option v-for="(item, key) in mapping.poiStatusMap" :key="key" :value="+key" :label="item" />
        </Select>
      </FormItem>
      <FormItem :required="taskVo.hasOpenTime" label="选择开园时间:" prop="expectedOpenTime" :helper="OpenScenicHelper">
        <RadioGroup v-model="taskVo.hasOpenTime">
          <Radio :value="false">暂无开园时间</Radio>
          <Radio :value="true">预开园时间</Radio>
        </RadioGroup>
        <DatePicker v-if="taskVo.hasOpenTime" :options="datePickerOption" v-model="taskVo.expectedOpenTime" placeholder="选择时间" style="width: 240px;" value-format="yyyy-MM-dd"></DatePicker>
      </FormItem>
      <FormItem required label="景区公告:" prop="publishAnnouncement">
        <RadioGroup v-model="taskVo.publishAnnouncement">
          <Radio :value="true">添加</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem v-if="taskVo.publishAnnouncement" label="公告模板:" prop="poiStatus">
        <Select v-model="taskVo.announcement.announcementTemplate" disabled>
          <Option v-for="(item, key) in mapping.poiAnnouncementMap" :key="key" :value="+key" :label="item" />
        </Select>
      </FormItem>
      <FormItem required v-if="taskVo.publishAnnouncement" label="公告展示时间:" prop="publishAnnouncement">
        <DatePicker :options="datePickerOption" type="daterange" v-model="announcementDate" placeholder="选择时间" style="width: 240px;" value-format="yyyy-MM-dd" @change="announceDateChange">
        </DatePicker>
      </FormItem>
      <FormItem v-if="taskVo.publishAnnouncement" label="公告标题:" prop="announcementTitle">
        <Input v-model="taskVo.announcement.announcementTitle" />
      </FormItem>
      <FormItem v-if="taskVo.publishAnnouncement" required label="公告内容:" prop="announcement.announcementContent" helper="通过审核后，该公告内容默认展示在第一位，如需调整排序请联系公告运营人员">
        <Textarea
          :autosize="{ minRows: 3, maxRows: 6 }"
          style="width: 500px;"
          v-model="taskVo.announcement.announcementContent"
          placeholder="由于XX原因，从XX年XX月XX日起暂停营业，恢复开园时间敬请留意景区通知"
        />
      </FormItem>
      <FormItem required label="操作订单退款:" prop="refundOrder">
        <RadioGroup v-model="taskVo.refundOrder">
          <Radio :value="true">是</Radio>
          <Radio :value="false">否</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem v-if="taskVo.refundOrder" required label="退款的业务线:" prop="businessLines">
        <CheckboxGroup v-model="taskVo.businessLines">
          <Checkbox v-for="(item, key) in mapping.businessLineMap" :key="key" :value="+key"> {{ item }}</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem v-if="taskVo.refundOrder" required label="退款时间段:" prop="refundTime" helper="游玩日/有效期结束时间在该时间段内的订单全部发起退款">
        <DatePicker
          :options="datePickerOption"
          type="datetimerange"
          v-model="taskVo.refundTime"
          placeholder="选择时间"
          style="width:
          240px;"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="refundTimeChange"
        >
        </DatePicker>
      </FormItem>
      <FormItem v-if="taskVo.refundOrder" label="退款操作说明:" prop="businessLines">
        <Textarea :autosize="{ minRows: 4, maxRows: 6 }" style="width: 500px;" v-model="taskVo.refundDetail" />
      </FormItem>
      <FormItem required label="担保人确认" prop="refundConfirmRole.role">
        <RadioGroup v-model="taskVo.refundConfirmRole.role">
          <div>
            <Radio :value="1">
              请确认已经和<b>商家对接人</b>
              <Input genre="line" v-model="meichantsName" class="name-input" />
              沟通退款操作说明，且对方同意此操作方式。
            </Radio>
            <br />
            <Radio :value="2">
              请确认<b>BD</b>
              <Input genre="line" v-model="bdName" class="name-input" />
              已经和商家对接人沟通退款操作说明，且对方同意此操作方式。
            </Radio>
          </div>
        </RadioGroup>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="submit">提交</Button>
        <Button type="primary" @click="save" style="margin-left: 20px;">保存</Button>
      </FormItem>
    </Form>
  </div>
</template>
<style></style>
<script>
import { Form, FormItem, Input, Select, Option, DatePicker, Checkbox, CheckboxGroup, Radio, RadioGroup, Textarea, Button, Loading } from '@ss/mtd-vue'
import moment from 'moment'
import mapping from '../lib/config'
import api from '../api'

export default {
  data() {
    return {
      mapping,
      taskVo: {
        taskId: '',
        taskDisplayId: '',
        taskBd: '',
        bdRegion: '',
        taskType: 1,
        closeType: '',
        cityId: '',
        cityName: '',
        pois: '',
        poiIds: '',
        poiStatus: 1,
        publishAnnouncement: true,
        announcement: {
          announcementTitle: '重要通知',
          announcementContent: '',
          announcementBeginDate: '',
          announcementEndDate: '',
          announcementTemplate: 1,
        },
        businessLines: [1, 2, 3],
        refundOrder: false,
        refundBeginTime: '',
        refundEndTime: '',
        refundDetail:
          '1.未消费订单会全额退给用户，退款金额由商家承担\n 2.如果有手续费，手续费由商家承担\n 3.如果deal退款规则不支持退款，系统会发起强退，可能会有结算、对账问题，请先确认商家知晓\n 4.退款成功后，会短信通知用户，告知用户由于景区闭园主动为其办理退款。',
        refundTime: [],
        refundConfirmRole: {
          role: 1,
          name: '',
        },
        expectedOpenTime: '',
        hasOpenTime: false,
      },
      announcementDate: [],
      cityList: [],
      poiList: [],
      loading: false,
      datePickerOption: {
        disabledDate(date) {
          return moment(date).isBefore(moment().format('YYYY-MM-DD'))
        },
      },
      meichantsName: '',
      bdName: '',
      userInfo: {},
    }
  },
  computed: {
    OpenScenicHelper() {
      return this.taskVo.hasOpenTime
        ? '有预开园时间，门票、跟团deal不下线，系统会关闭闭园期间在线deal价格日历或下线有效期deal「除景酒业务」'
        : '默认下线门票、跟团、景酒全部业务线「除景区外项目和导览票」的在线deal'
    },
    isRightPoiIds() {
      return /^\d+(,\s*\d+\s*)*$/.test(this.taskVo.poiIds)
    },
    isUrgentRole() {
      return this.userInfo.role === 3
    },
  },
  methods: {
    async getCities(keyword) {
      this.cityList = await api.getCities({ keyword })
    },
    async getPois(keyword) {
      let params = {}
      if (keyword) {
        params.keyword = keyword
      }
      if (this.taskVo.cityId) {
        params.cityId = this.taskVo.cityId
      }
      if (Object.keys(params).length) {
        this.poiList = await api.getPois(params)
        console.log(this.poiList)
      }
    },
    announceDateChange(value) {
      this.taskVo.announcement.announcementBeginDate = value[0]
      this.taskVo.announcement.announcementEndDate = value[1]
    },
    refundTimeChange(value) {
      this.taskVo.refundBeginTime = value[0]
      this.taskVo.refundEndTime = value[1]
    },
    async cityChange(id) {
      if (id) {
        let city = this.cityList.find(city => city.cityId === id)
        this.taskVo.cityName = city && city.cityName
        this.loading = true
        this.poiList = await api.getPois({ cityId: id })
        this.$nextTick(() => {
          this.loading = false
          this.taskVo.pois = []
        })
      }
    },
    async save(isJump = true) {
      console.log('save')
      if (this.isUrgentRole) {
        try {
          if (!this.isRightPoiIds) {
            throw 'poiId列表输入不合法，请重新输入!'
          }
        } catch (error) {
          this.$mtd
            .confirm({
              title: '注意',
              type: 'warning',
              message: error,
            })
            .then(() => {})
            .catch(() => {})
          throw error
        }
      }

      try {
        await this.$refs.form.validate()
      } catch (error) {
        this.$mtd
          .confirm({
            title: '注意',
            type: 'warning',
            message: '表单中有必填项为空',
          })
          .then(() => {})
          .catch(() => {})
        throw error
      }
      console.log('校验成功')
      // return
      let {
        taskId,
        taskBd,
        bdRegion,
        taskType,
        closeType,
        cityId,
        cityName,
        poiIds,
        pois,
        poiStatus,
        publishAnnouncement,
        announcement,
        businessLines,
        refundOrder,
        refundBeginTime,
        refundEndTime,
        refundDetail,
        refundConfirmRole,
        expectedOpenTime,
        hasOpenTime,
      } = this.taskVo
      let obj = {
        taskId: taskId ? taskId : null,
        taskBd,
        bdRegion,
        taskType,
        closeType,
        cityId: cityId ? cityId : null,
        cityName: cityId ? cityName : null,
        pois: this.isUrgentRole
          ? poiIds.split(',').map(poi => {
              return {
                poiId: poi,
                poiName: null,
                cityName: null,
              }
            })
          : pois.map(poi => JSON.parse(poi)),
        //根据管理员角色创建不同的poi
        poiStatus,
        publishAnnouncement,
        announcement: publishAnnouncement ? announcement : null,
        refundOrder,
        businessLines: refundOrder ? businessLines : null,
        refundBeginTime: refundOrder ? refundBeginTime : null,
        refundEndTime: refundOrder ? refundEndTime : null,
        refundDetail: refundOrder ? refundDetail : null,
        refundConfirmRole: {
          role: refundConfirmRole.role,
          name: refundConfirmRole.role === 1 ? this.meichantsName : this.bdName,
        },
        expectedOpenTime: hasOpenTime ? expectedOpenTime : null,
      }
      let params = {}
      for (let key in obj) {
        if (obj[key] !== null) {
          params[key] = obj[key]
        }
      }
      console.log(params)
      if (this.$route.name === 'closedTaskCreate') {
        this.taskVo.taskId = await api.saveTask(params)
      } else {
        this.taskVo.taskId = await api.modifyTask(params)
      }
      if (isJump) {
        this.$router.push({ name: 'scenicClosedTaskList' })
      }
    },
    async submit() {
      try {
        await this.save(false)
        await api.submitTask(this.taskVo.taskId)
        this.$router.push({ name: 'scenicClosedTaskList' })
      } catch (error) {
        return error
      }
    },
  },
  components: {
    Form,
    FormItem,
    Input,
    Select,
    Option,
    DatePicker,
    Checkbox,
    CheckboxGroup,
    Radio,
    RadioGroup,
    Textarea,
    Button,
    Loading,
  },
  async created() {
    this.userInfo = await api.getRole()
    if (this.$route.name === 'closedTaskCreate') {
      this.taskVo.taskBd = {
        bdId: this.userInfo.bdId,
        bdMis: this.userInfo.bdMis,
        bdName: this.userInfo.bdName,
      }
      this.taskVo.bdRegion = await api.getOrgPath({ misId: this.userInfo.bdId })
      let bdCity = await api.getBdCity({ mis: this.userInfo.bdId })
      if (bdCity) {
        this.taskVo.cityId = bdCity.cityId
        this.taskVo.cityName = bdCity.cityName
        this.cityList = [{ cityId: bdCity.cityId, cityName: bdCity.cityName }]
      }
    }
    if (this.$route.name === 'closedTaskModify') {
      this.taskVo = await api.getTask(this.$route.params.id)
      this.poiList = this.taskVo.pois
      this.taskVo.refundTime = [this.taskVo.refundBeginTime, this.taskVo.refundEndTime]
      this.taskVo.pois = this.taskVo.pois.map(poi => JSON.stringify(poi))
      this.announcementDate = [this.taskVo.announcement.announcementBeginDate, this.taskVo.announcement.announcementEndDate]
      if (!this.taskVo.refundConfirmRole) {
        this.taskVo.refundConfirmRole = {
          role: 1,
          name: '',
        }
      }
      this.meichantsName = this.taskVo.refundConfirmRole.role === 1 ? this.taskVo.refundConfirmRole.name : ''
      this.bdName = this.taskVo.refundConfirmRole.role === 2 ? this.taskVo.refundConfirmRole.name : ''
      this.cityList = [
        {
          cityId: this.taskVo.cityId,
          cityName: this.taskVo.cityName,
        },
      ]
      this.$set(this.taskVo, 'hasOpenTime', !!this.taskVo.expectedOpenTime)
    }
  },
}
</script>
<style lang="scss" scoped>
.closed-create {
  .item-label {
    color: rgba(0, 0, 0, 0.6);
    margin-left: 20px;
  }

  >>> .mtd-form-item-helper {
    color: $color-danger;
    vertical-align: middle;
  }

  .name-input {
    width: 100px;
    padding: 0 5px;
  }
}

.warning-tips-urgent {
  color: #f52c37;
  font-size: 12px;
  line-height: 20px;
  margin-top: 0;
}
</style>
