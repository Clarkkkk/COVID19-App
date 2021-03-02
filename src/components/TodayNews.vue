<template>
  <div id="today-news" class="covid-flex-item">
    <div
      v-for="news in newsData"
      :key="news.articleId"
    >
      <article class="news-container">
        <div class="update-time">
          {{ news.pubDate }}
        </div>
        <h2 class="title">{{ news.title }}</h2>
        <div class="tags">
          <div
            class="tag"
            v-for="tag in news.tags"
            :key="tag"
          >
            {{ tag }}
          </div>
        </div>
        <div class="description" v-html="news.description"></div>
        <footer class="info-container">
          <span class="source" v-html="news.source"></span>
        </footer>
      </article>
    </div>
  </div>
</template>

<script>
import fetchJSON from '@/utils/fetchJSON';
export default {
  data() {
    return {
      newsData: [],
      tags: []
    };
  },
  methods: {
    extractTags(str) {
      const iterator = str.matchAll(/(#.*?)([ 【])/g);
      const result = [];
      for (const item of iterator) {
        result.push(item[1]);
      }
      return result;
    },

    extractSource(str) {
      const sources =
        /([(（]\s*)(<a href="[^"]*")([^>]*)(>)([^<]*)(<\/a>)(\s*[)）])/g;
      const iterator = str.matchAll(sources);
      const result = [];
      for (const item of iterator) {
        result.push(item[2] + item[4] + item[5] +item[6]);
      }
      return '来源：' + result.join('、');
    },

    parseTitle(str) {
      return str.match(/【(.[^】]*)(】)?/)[1];
    },

    parseDescription(str) {
      const wraps = /(\r|\n|\t)+/g;
      const content = /^(.*)?(<p>)(<a.*】)(<\/?.{0,2}>)*/;
      const sources =
        /(（\s*)(<a href="[^"]*")([^>]*)(>)([^<]*)(<\/a>)(\s*）)/g;
      return str
        .replace(wraps, '')
        .replace(content, '$2')
        .replace(/<br>\s*<br>/g, '</p><p>')
        .replace(/\(/g, '（').replace(/\)/g, '）')
        .replaceAll(sources, '');
    },

    parseDate(str) {
      return (new Date(str)).toLocaleString();
    },

    isPinned(str) {
      return /pinned/.test(str);
    }
  },
  created() {
    fetchJSON('/news').then((data) => {
      console.log(data);
      const pinnedIndices = [];
      data.forEach((entry, index) => {
        if (this.isPinned(entry.title)) {
          pinnedIndices.push(index + 1);
        } else {
          const news = {};
          news.pinned = pinnedIndices.indexOf(index) >= 0;
          news.tags = this.extractTags(entry.title);
          news.title = this.parseTitle(entry.title);
          news.description = this.parseDescription(entry.description);
          news.source = this.extractSource(entry.description);
          news.pubDate = this.parseDate(entry.pubDate);
          this.newsData.push(news);
          this.tags.push(...news.tags);
        }
      });
      this.tags = [...(new Set(this.tags))];
    });
  }
};
</script>

<style scoped>
#today-news {
  padding: 1.5rem;
}

.news-container {
  padding-left: 1.5rem;
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  text-align: left;
  border-left: 1px solid #ccc;
}

.update-time {
  height: 1rem;
  font-size: 0.8rem;
  margin-bottom: 1rem;
  margin-top: -0.5rem;
  margin-left: -1.75rem;
  display: flex;
  align-items: center;
}

.update-time::before {
  content: '';
  height: 0.5rem;
  width: 0.5rem;
  margin-right: 0.5rem;
  border-radius: 1rem;
  background-color: #74cfcb;
  display: inline-block;
}

.title {
  font-size: 1.1rem;
  font-weight: bold;
  margin: 0;
  padding: 0;
}

.tags {
  min-height: 2rem;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  margin-bottom: 0.5rem;
}

.tag {
  height: 1.2rem;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0 0.6rem;
  margin-right: 0.5rem;
  margin-bottom: 0.3rem;
  color: white;
  background-color: #00666d;
  font-size: 0.8rem;
  letter-spacing: 1px;
  border-radius: 1rem;
}

.description {
  margin: 0;
}

.description >>> p {
  margin: 0;
  margin-bottom: 0.6rem;
  padding: 0;
}

.info-container {
  align-self: flex-end;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  margin-bottom: 3rem;
}
</style>
