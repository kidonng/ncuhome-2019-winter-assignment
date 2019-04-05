<template>
  <div>
    <nav>
      <h1>Readhub</h1>
      <router-link
        v-for="(title, name, i) in categories"
        :to="{ name }"
        :key="i"
      >
        {{ title }}
      </router-link>
    </nav>

    <router-view></router-view>
  </div>
</template>

<style lang="stylus">
body
  font-family -apple-system, Noto Sans, Segoe UI, Helvetica Neue, Helvetica, Arial, Liberation Sans, PingFang SC, Hiragino Sans GB, Noto Sans CJK SC, Source Han Sans SC, Source Han Sans CN, Microsoft YaHei, Wenquanyi Micro Hei, WenQuanYi Zen Hei, ST Heiti, SimHei, WenQuanYi Zen Hei Sharp, sans-serif
  line-height 1.5
  margin m auto
  width 90vw

  @media (min-width 768px)
    &
      width 50vw

nav
h1
  font-size xxl

nav
  display flex
  font-weight 500
  justify-content space-between

  @media (min-width 768px)
    &
      justify-content normal

      a
        margin-left xxl

h1
  margin 0

h2
h3
h4
  font-weight 500
  margin-top xxs
  margin-bottom @margin-top

h2
  font-size xl

h3
  font-size l

h4
  font-size m

ul
  padding-inline-start m

li
  margin-bottom xxs

a
  color #000
  text-decoration none

  &:hover
  &.router-link-active
    color #06c

strong
  font-weight 500

.topic
  margin-bottom xxs

  &:not(:first-of-type)
    border-top 1px solid rgba(0 0 0 .1)

.meta
  color #999
  font-size s

.summary
  color #666
  line-height rem(28)
</style>
