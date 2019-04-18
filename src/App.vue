<template lang="pug">
  div
    nav
      h1 Readhub
      router-link(
        v-for="(title, name, i) in categories"
        :to="{ name }"
        :key="i"
      ) {{ title }}

    router-view
</template>

<style lang="stylus">
@import "./styles/base"
@import "./styles/nprogress"

body
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
  justify-content space-between

  @media (min-width 768px)
    &
      justify-content normal

      h1
        margin-right l

      a
        margin-right l
        margin-left l

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
    color theme

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
