<template>
  <v-row justify="center">
    <v-col>
      <v-container fluid>
        <v-row justify="center">
          <v-snackbar v-model="snackbar" color="success" :timeout="1500" :top="true">
            操作成功！
            <template v-slot:action="{ attrs }">
              <v-btn dark text v-bind="attrs" @click="snackbar = false">关闭</v-btn>
            </template>
          </v-snackbar>
        </v-row>
        <v-row justify="center">
          <v-dialog v-model="del" max-width="290">
            <v-card>
              <v-card-title class="headline">你确定删除该配置吗？</v-card-title>

              <v-card-text>删除后无法恢复.</v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="del = false">再想想</v-btn>
                <v-btn color="error" text @click="delDatabase">确定</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
        <!-- 添加新配置或者修改跑配置的对话框 -->
        <v-row justify="center">
          <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
              <v-card-title>
                <span class="headline">添加/修改配置</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field label="连接名称*" required v-model="nowData.name"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field label="连接地址*" hint="哨兵集群或者redis集群应该将master放最前面.格式:ip:port,ip:port........" v-model="nowData.address"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field label="用户名*" required v-model="nowData.username"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field label="密码*" type="password" required v-model="nowData.password"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select :items="['SINGLON','CLUSTER', 'SENTINEL']" label="连接类型*" required v-model="nowData.type"></v-select>
                    </v-col>
                  </v-row>
                </v-container>
                <small>*是必填项目</small>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialog = false">关闭</v-btn>
                <v-btn color="blue darken-1" text @click="addDatabase">保存</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
        <!--对话框结束-->
        <v-row>
          <v-col cols="4">
            <v-text-field v-model="key" label="关键字" required></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-btn class="my-4" @click="findDatabase">
              <v-icon>mdi-cloud-search</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="4">
            <v-btn class="my-4" @click="dialog=true">
              <v-icon>mdi-note-plus</v-icon>添加新配置
            </v-btn>
          </v-col>
        </v-row>
        <!-- header结束 -->
        <v-row>
          <v-col cols="12">
            <v-data-iterator :items="items" hide-default-footer>
              <template v-slot:default="props">
                <v-row>
                  <v-col v-for="item in props.items" :key="item.id" cols="12" sm="6" md="4" lg="4">
                    <v-card flat>
                      <v-card-title class="subheading font-weight-bold">{{ item.name }}</v-card-title>

                      <v-divider></v-divider>

                      <v-list dense>
                        <v-list-item>
                          <v-list-item-content>地址:</v-list-item-content>
                          <v-list-item-content class="align-end">{{ item.address }}</v-list-item-content>
                        </v-list-item>

                        <v-list-item>
                          <v-list-item-content>用户名:</v-list-item-content>
                          <v-list-item-content class="align-end">{{ item.username }}</v-list-item-content>
                        </v-list-item>

                        <v-list-item>
                          <v-list-item-content>密码:</v-list-item-content>
                          <v-list-item-content class="align-end">{{ item.password }}</v-list-item-content>
                        </v-list-item>

                        <v-list-item>
                          <v-list-item-content>最后修改时间:</v-list-item-content>
                          <v-list-item-content class="align-end">{{ item.modifytime }}</v-list-item-content>
                        </v-list-item>

                        <v-list-item>
                          <v-list-item-content>类型:</v-list-item-content>
                          <v-list-item-content class="align-end">{{ item.type }}</v-list-item-content>
                        </v-list-item>
                      </v-list>
                      <v-card-actions>
                        <v-btn text color="error" @click=" active = item.id ;del=true">删除</v-btn>
                        <v-btn text color="primary" @click="showUpdate(item.id)">修改</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
              </template>

              <template v-slot:footer>
                <v-toolbar flat>
                  <v-spacer></v-spacer>
                  <v-pagination :total-visible="6" v-model="page" :length="total" circle></v-pagination>
                </v-toolbar>
              </template>
            </v-data-iterator>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    baseurl: '/data/',
    page: 1,
    total: 0,
    snackbar: false,
    active: '',
    nowData: {
      name: '',
      type: 'SINGLON',
      address: '',
      username: '',
      password: ''
    },
    items: [],
    key: '',
    del: false,
    dialog: false
  }),
  watch: {
    page (value) {
      this.findDatabase(value)
    },
    dialog (value) {
      if (!value) this.active = null
    },
    del (value) {
      if (!value) this.active = null
    }
  },
  mounted () {
    this.findDatabase()
  },
  methods: {
    addDatabase () {
      if (this.nowData.id !== '' && this.nowData.id !== undefined && this.nowData.id !== null) {
        this.updateDatabase()
        return
      }
      this.$http.post(this.baseurl + 'add', this.nowData)
        .then(response => response.data)
        .then(data => {
          if (data.status === 1) {
            this.snackbar = true
          }
        })
      this.dialog = false
    },
    showUpdate (id) {
      this.dialog = true
      this.nowData = this.items.find(i => i.id === id)
    },
    updateDatabase () {
      this.$http.put(this.baseurl + 'update', this.nowData)
        .then(response => response.data).then(data => {
          if (data.status === 1) {
            this.snackbar = true
          }
        })
      this.active = ''
      this.dialog = false
    },
    delDatabase () {
      this.$http.delete(this.baseurl + 'del/' + this.active)
        .then(response => response.data).then(data => {
          if (data.status === 1) {
            this.snackbar = true
          }
        })
      this.del = false
    },
    findDatabase () {
      this.$http.get(this.baseurl + 'find/' + (this.key === '' ? '$' : this.key) + '/' + this.page)
        .then(response => response.data)
        .then(data => {
          this.total = data.data.pages
          this.items = data.data.list
        })
    }
  }
}
</script>

<style>
</style>
