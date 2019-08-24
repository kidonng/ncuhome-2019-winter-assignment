<template>
  <div>
    <article v-if="brief.length" ref="toggle">
      <h2
        class="expandable"
        @click="$refs.toggle.classList.toggle('expand-brief')"
      >
        行情简报
        <svg class="expand-icon" viewBox="0 0 24 24">
          <path
            d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
          />
        </svg>
      </h2>
      <div class="collapse">
        <div class="columns">
          <div class="column" v-for="{ date, positions } in brief" :key="date">
            <h3>{{ date }}</h3>
            <ul>
              <li
                v-for="(position, i) in positions"
                :key="i"
                v-html="highlight(position)"
              />
            </ul>
          </div>
        </div>
      </div>
    </article>

    <article class="day" v-for="{ date, positions } in jobs" :key="date">
      <h2>{{ date }}</h2>
      <section
        class="topic"
        v-for="({
          jobTitle,
          jobsArray,
          cities,
          jobCount,
          salaryLower,
          salaryUpper,
          experienceLower,
          experienceUpper
        },
        i) in positions"
        :key="i"
        ref="refs"
      >
        <h3
          class="expandable"
          @click="$refs.refs[i].classList.toggle('expand')"
        >
          {{ jobTitle | spacing }}
          <svg viewBox="0 0 24 24">
            <path
              d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
            />
          </svg>
        </h3>
        <div class="meta">
          {{ jobsArray.map(job => job.title).join('・') | spacing }}
        </div>
        <div class="summary">
          {{ Object.keys(cities)[0] }}、{{ Object.keys(cities)[1] }}等地共更新了
          {{ jobCount }} 个职位，待遇集中在 {{ salaryLower }}-{{
            salaryUpper
          }}k，一般要求 {{ experienceLower }}-{{ experienceUpper }} 年经验
        </div>

        <div class="collapse">
          <div
            v-for="{
              url,
              title,
              sponsor,
              company,
              salaryLower,
              salaryUpper,
              experienceLower,
              experienceUpper,
              city,
              siteName
            } in jobsArray"
            :key="url"
          >
            <h4>
              <a :href="url">
                {{ title | spacing }}
              </a>
              <span class="meta">
                {{ sponsor ? `${company}（赞助商）` : company }}
              </span>
            </h4>

            <div class="meta">
              <span class="salary">
                {{
                  salaryLower > 0 ? `${salaryLower}-${salaryUpper}k` : '面议'
                }}
              </span>
              <span class="experience">
                {{
                  experienceLower === -1
                    ? '经验不限'
                    : experienceUpper === -1
                    ? `${experienceLower} 年以上`
                    : `${experienceLower}-${experienceUpper} 年`
                }}
              </span>
              <span>{{ city }}</span>
              <span class="site">{{ siteName }}</span>
            </div>
          </div>
        </div>
      </section>
    </article>
  </div>
</template>

<script>
import { ref, computed, onMounted } from '@vue/composition-api'
import pangu from 'pangu'
import api from '../utils/api'
import useInfiniteScroll from '../utils/infiniteScroll'

export default {
  setup() {
    const brief = ref([])
    const jobs = ref([])
    const refs = ref(null)
    const route = ref('jobs')
    const lastCursor = computed(() =>
      Date.parse([...[...jobs.value].pop().positions].pop().publishDate)
    )
    useInfiniteScroll(jobs, refs, route, lastCursor)

    const highlight = post =>
      pangu.spacing(
        post.content
          .split(post.jobTitle)
          .join(` <strong>${post.jobTitle}</strong> `)
      )

    onMounted(async () => {
      ;({ data: brief.value } = await api('jobs/brief'))
      ;({ data: jobs.value } = await api('jobs'))
    })

    return { brief, jobs, refs, highlight }
  }
}
</script>

<style lang="stylus" scoped>
.column h3
  margin-top 0

@media (min-width: 768px)
  .columns
    column-count 2

  .column
    break-inside avoid

.expandable
  cursor pointer

  svg
    width 24px
    vertical-align bottom
    transition transform .3s

    .expand &
    .expand-brief &
      transform rotate(180deg)

  &:hover
    color theme

    svg
      fill theme

.summary
  margin-top xxs

.collapse
  max-height 0
  overflow hidden
  transition max-height .3s

  .expand &
    max-height rem(320)

  .expand-brief &
    max-height rem(2500)

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
