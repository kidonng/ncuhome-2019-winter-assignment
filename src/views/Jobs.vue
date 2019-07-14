<template>
  <div>
    <article v-if="Object.keys(brief).length">
      <h2>行情简报</h2>
      <div class="columns">
        <div class="column" v-for="(positions, date) in brief">
          <h3>{{ date }}</h3>
          <ul>
            <li v-for="position in positions">{{ position | post }}</li>
          </ul>
        </div>
      </div>
    </article>

    <article class="day" v-for="(positionArray, date) in jobs">
      <h2>{{ date }}</h2>
      <section class="topic" v-for="positions in positionArray">
        <h3
          @click="
            e =>
              e.target.parentElement
                .querySelector('.collapse')
                .classList.toggle('show')
          "
        >
          {{ positions.jobTitle | spacing }}
        </h3>
        <div class="meta">
          {{ positions.jobsArray.map(i => i.title).join('、') | spacing }}
        </div>
        <div class="summary">
          {{
            `${Object.keys(positions.cities)[0]}、${
              Object.keys(positions.cities)[1]
            }等地共更新了 ${positions.jobCount} 个职位，待遇集中在 ${
              positions.salaryLower
            }-${positions.salaryUpper}k，一般要求 ${
              positions.experienceLower
            }-${positions.experienceUpper} 年经验`
          }}
        </div>

        <div class="collapse">
          <div v-for="job in positions.jobsArray">
            <h4>
              <a :href="job.url" target="_blank">{{ job.title | spacing }}</a>
              <span class="meta">{{
                job.sponsor ? `${job.company}（赞助商）` : job.company
              }}</span>
            </h4>

            <div class="meta">
              <span class="salary">{{
                job.salaryLower === -1
                  ? '面议'
                  : `${job.salaryLower}-${job.salaryUpper}k`
              }}</span>
              <span class="experience">{{
                job.experienceLower === -1
                  ? '经验不限'
                  : job.experienceUpper === -1
                  ? `${job.experienceLower} 年以上`
                  : `${job.experienceLower}-${job.experienceUpper} 年`
              }}</span>
              <span>{{ job.city }}</span>
              <span class="site">{{ job.siteName }}</span>
            </div>
          </div>
        </div>
      </section>
    </article>
  </div>
</template>

<script>
import { value, watch, onMounted, onUnmounted } from 'vue-function-api'

export default {
  setup(props, context) {
    const jobs = value({})
    const brief = value({})

    const categorize = (position, isJobs) => {
      let time = new Date(isJobs ? position.createdAt : position.date)
      let now = new Date()
      const target = isJobs ? jobs.value : brief.value

      if (isJobs) {
        time.setDate(time.getDate() + 1)
        now.setHours(0, 0, 0, 0)

        if (time >= now) time = '今天'
        else if (time >= now.setDate(now.getDate() - 1)) time = '昨天'
        else
          time = `${time.getFullYear()} 年 ${time.getMonth() +
            1} 月 ${time.getDate()} 日`
      } else {
        if (time.getFullYear() === now.getFullYear())
          time = `${time.getMonth() + 1} 月 ${time.getDate()} 日`
        else
          time = `${time.getFullYear()} 年 ${time.getMonth() +
            1} 月 ${time.getDate()} 日`
      }

      if (target[time]) target[time].push(position)
      else context.root.$set(target, time, [position])
    }

    const observer = new IntersectionObserver(async ([entry]) => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target)

        const { data } = await context.root
          .ky('/api/jobs', {
            searchParams: {
              lastCursor: Date.parse(
                [...[...Object.values(jobs.value)].pop()].pop().publishDate
              )
            }
          })
          .json()

        data.forEach(position => categorize(position, true))
      }
    })

    watch(
      () => Object.values(jobs.value),
      values => {
        if (values.length) {
          observer.observe(
            document.querySelector('.day:last-child .topic:last-child')
          )
        }
      }
    )

    onMounted(async () => {
      const jobs = (await context.root.ky('/api/jobs').json()).data
      jobs.forEach(position => categorize(position, true))

      const brief = (await context.root.ky('/api/jobs/brief').json()).data
      brief.forEach(position => categorize(position, false))
    })
    onUnmounted(() => observer.disconnect())

    return {
      jobs,
      brief
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "../styles/variables.styl"

.column h3
  margin-top 0

@media (min-width 768px)
  .columns
    column-count 2

  .column
    break-inside avoid

.topic h3
  cursor pointer

  &:hover
    color theme

.summary
  margin-top xxs

.collapse
  max-height 0
  overflow hidden
  transition max-height .3s

  &.show
    max-height rem(320)

h4 .meta
  font-weight initial
  margin-left xxs

.salary
.experience
  margin-right xxs

.salary
  color #d66
  font-weight 500

.site
  float right
</style>
