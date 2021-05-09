<template>
  <v-row justify="center">
    <v-col>
      <v-container fluid>
        <v-row justify="center">
          <v-snackbar v-model="snackbar" color="success" :timeout="1500" :top="true">
           {{msg}}
            <template v-slot:action="{ attrs }">
              <v-btn dark text v-bind="attrs" @click="snackbar = false">关闭</v-btn>
            </template>
          </v-snackbar>
        </v-row>
        <v-row>
          <v-col cols="3">
            <v-autocomplete v-model="host" :items="hosts" outlined dense label="主机" :item-text="i => i.name" :item-value="i=>i.id"></v-autocomplete>
          </v-col>
          <v-col cols="2" >
            <v-autocomplete v-model="type" :items="types" outlined dense label="命令"></v-autocomplete>
          </v-col>
          <v-col cols="7">
            <v-text-field  v-model="command" label="命令/参数" dense outlined  @keyup.enter="runCommand"></v-text-field>
          </v-col>
        </v-row>
          <v-divider></v-divider>
        <v-row justify="center">
          <v-col>
                <textarea class="grey lighten-3" style="width:100%; " :value="dataValue" rows="18"></textarea>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    baseurl: '/',
    type: 'KEYS',
    snackbar: false,
    types: ['KEYS', 'GET', 'SET', 'DEL', 'OTHER'],
    host: '',
    command: '',
    hosts: [],
    msg: '',
    data: {}
  }),
  computed: {
    dataValue: function () {
      return JSON.stringify(this.data, null, '\t')
    }
  },
  mounted () {
    this.$http.get(this.baseurl + 'data/all')
      .then(res => res.data)
      .then(data => {
        if (data.status === 1) {
          this.hosts = data.data
        }
      })
  },
  methods: {
    runCommand () {
      if (this.host === '') {
        this.msg = '主机不能为空'
        this.snackbar = true
        return
      }
      if (this.command === '') {
        this.msg = '命令/参数不能为空'
        this.snackbar = true
        return
      }
      this.$http.post(this.baseurl + 'command/run', {
        hostId: this.host,
        type: this.type,
        command: this.command
      }).then(res => res.data)
        .then(data => {
          this.data = data
          if (data.status !== 1) {
            this.msg = data.msg
            this.snackbar = true
          }
        })
    }
  }
}
</script>

<style>
</style>
