<template>
  <div id="today-news">
    <div class="content">
      <div
        v-for="news in newsData"
        :key="news.articleId"
      >
        <article class="timeline">
          <div class="timeline-time">
            {{ news.pubDate }}
          </div>
          <h2 class="timeline-title">{{ news.title }}</h2>
          <div class="timeline-content">
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
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import {fetchJSON} from '@/utils';
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
        item[2] = item[2].replace(/<a href="/, `<a target="_blank" rel="noopener" href="`);
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

<style lang="scss" scoped>
.content {
  @extend %container;
  height: 291.5vh;
  width: 100%;
  padding: 1.5rem;
  box-sizing: border-box;
  overflow: scroll;
  background-color: var(--container-background-color);
}

@include desktop {
  .content {
    padding: 3rem;
  }
}

.timeline {
  .tags {
    min-height: 2rem;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    margin-bottom: 0.5rem;

    > .tag {
      height: 1.2rem;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      padding: 0 0.6rem;
      margin-right: 0.5rem;
      margin-bottom: 0.3rem;
      color: white;
      background-color: var(--app-color-darker);
      font-size: $font-size-small;
      letter-spacing: 1px;
      border-radius: 1rem;
    }
  }

  .description {
    margin: 0;
    font-size: $font-size-normal;
    line-height: $font-size-normal * 1.5;
  }

  .description::v-deep p {
    margin: 0;
    margin-bottom: 0.6rem;
    padding: 0;
  }

  footer {
    align-self: flex-end;
    font-size: $font-size-small;
    margin-top: 0.5rem;
    margin-bottom: 3rem;
  }
}
</style>
