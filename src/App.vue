<template>
  <div>
    <nav>
      <h1>
        <a href="https://github.com/kidonng/readhub" title="GitHub">
          Readhub
        </a>
      </h1>
      <router-link
        v-for="{ name, title } in categories"
        :to="{ name }"
        :key="name"
      >
        {{ title }}
      </router-link>
    </nav>

    <router-view />
  </div>
</template>

<script lang="ts">
import { router } from './plugins/router'

export default {
  computed: {
    categories() {
      return router
        .getRoutes()
        .filter(({ name, meta }) => name !== 'topic' && meta)
        .map(({ name, meta: { title } }) => ({ name, title }))
    },
  },
}
</script>

<style lang="stylus">
@import './variables'

body
  line-height 1.5
  margin m auto
  width 90vw

  @media (min-width: 768px)
    &
      width 50vw

nav
h1
  font-size xxl

nav
  display flex
  justify-content space-between

  @media (min-width: 768px)
    &
      justify-content normal

      a:not(:only-child)
        margin-left m * 2

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
  word-break break-word

#nprogress
  .bar
    background theme

  .peg
    box-shadow 0 0 10px theme 0 0 5px theme
</style>
