<template>
  <div id="today-news" class="covid-flex-item">
    <a-timeline>
      <a-timeline-item
        v-for="news in newsData"
        :key="news.articleId"
      >
        <div class="news-container">
          <span class="update-time">
            {{ (new Date(news.pubDate)).toLocaleString() }}
          </span>
          <span class="title">{{ news.title }}</span>
          <span class="summary">
            {{ news.summary }}{{ news.summary.length >= 200 ? '……' : '' }}
          </span>
          <div class="info-container">
            <span class="source">
              来源：
              <a :href="news.sourceUrl">{{ news.infoSource }}</a>
            </span>
          </div>
        </div>
      </a-timeline-item>
    </a-timeline>
  </div>
</template>

<script>
import fetchJSON from '@/utils/fetchJSON';
export default {
  data() {
    return {
      newsData: []
    };
  },
  methods: {
    removeDuplicates(arr) {
      const filtered = [];
      if (arr.length === 0) {
        console.log('The array is empty');
        return;
      } else if (arr.length === 1) {
        return arr;
      } else {
        for (let i = 0; i < arr.length - 1; i++) {
          let isDuplicated = false;
          for (const entry of filtered) {
            if (arr[i].articleId === entry.articleId) {
              isDuplicated = true;
              break;
            }
          }
          if (!isDuplicated) {
            filtered.push(arr[i]);
          }
        }
        return filtered;
      }
    }

  },
  created() {
    fetchJSON('', '/data/news.json').then((data) => {
      this.newsData = this.removeDuplicates(data.slice(0, 20));
    });
  }
};
</script>

<style scoped>
#today-news {
  padding: 1.5rem;
}

.news-container {
  padding: 0 1rem;
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  text-align: left;
}

.update-time {
  font-size: 0.8rem;
  margin-bottom: 1rem;
  margin-top: 0.1em;
  margin-left: -0.8rem;
}

.title {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.info-container {
  align-self: flex-end;
  font-size: 0.8rem;
  margin-top: 0.5rem;
}
</style>
