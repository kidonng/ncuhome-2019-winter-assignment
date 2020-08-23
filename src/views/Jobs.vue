<template>
  <div>
    <article v-if="brief">
      <h2 class="expandable">
        行情简报
        <svg class="expand-icon" viewBox="0 0 24 24">
          <path
            d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
          />
        </svg>
      </h2>
      <div class="collapse">
        <div class="columns">
          <div class="column" v-for="(positions, date) in brief" :key="date">
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

    <article class="day" v-for="(positions, date) in jobs" :key="date">
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
          experienceUpper,
        },
        i) in positions"
        :key="i"
        :ref="
          (el) => {
            if (i === topics.length - 1) lastItem = el
          }
        "
      >
        <h3 class="expandable">
          {{ spacing(jobTitle) }}
          <svg viewBox="0 0 24 24">
            <path
              d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
            />
          </svg>
        </h3>
        <div class="meta">
          {{ spacing(jobsArray.map((job) => job.title).join('・')) }}
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
              siteName,
            } in jobsArray"
            :key="url"
          >
            <h4>
              <a :href="url">
                {{ spacing(title) }}
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

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { api } from '../utils/api'
import { categorizeJobs, categorizeBrief } from '../utils/categorize'
import { useList } from '../utils/list'
import { last } from 'lodash-es'
import { BasicData, CategorizedData, UseList } from '../types/misc'
import { spacing } from '../plugins/filters'

const rawBrief = ref<Brief[]>([])
export const brief = computed(() => categorizeBrief(rawBrief.value))

onMounted(async () => {
  const { data } = await api('jobs/brief').json<BasicData<Brief>>()
  rawBrief.value = data
})

export const highlight = (brief: Brief) =>
  spacing(
    brief.content
      .split(brief.jobTitle)
      .join(` <strong>${brief.jobTitle}</strong> `)
  )

const lastCursor = computed(() => Date.parse(last(topics.value).publishDate))
const { topics, lastItem, load } = useList('jobs', lastCursor) as UseList<
  Position
>
export const jobs = computed(() => categorizeJobs(topics.value))

onMounted(load)

const expand = (e: MouseEvent) => {
  const target = (e.target as Element).closest('.expandable')
  if (target) target.classList.toggle('expand')
}

onMounted(() => document.addEventListener('click', expand))
onUnmounted(() => document.removeEventListener('click', expand))

export { lastItem, spacing }
</script>

<style lang="stylus" scoped>
@import '../variables'

timing = .5s

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
    transition transform timing

  &.expand svg
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
  transition max-height timing

  .expand ~ &
    // Ensure brief is fully expanded
    max-height 2500px

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
