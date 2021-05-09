<template>
    <v-app>
      <Header  @change-func="changeFunc"></Header>
    <Main :headerTitle="headerTitle">
      <router-view></router-view>
    </Main>
    <Footer @change-theme="changeTheme"></Footer>
    </v-app>
</template>

<script>
import Footer from './components/Footer'
import Main from './components/Main'
import Header from './components/Header'
export default {
  name: 'App',
  components: { Footer, Main, Header },
  data: () => ({
    headerTitle: ''
  }),
  methods: {
    changeFunc (func) {
      this.headerTitle = func.title
      const url = func.url
      this.$router.push(url)
    },
    changeTheme (dark) {
      this.$vuetify.theme.dark = dark
    }
  }
}
</script>
