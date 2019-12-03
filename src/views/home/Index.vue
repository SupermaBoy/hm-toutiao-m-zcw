<template>
  <div class="container">
    <!-- swipeable 开启滑动 -->
    <van-tabs swipeable v-model="activeIndex" :lazy-render="false" @change="changeChannel">
      <van-tab :key="item.id" v-for="item in MyChannels" :title="item.name ">
        <div class="scroll-wrapper" @scroll="remember($event)" ref="wrapper">
          <van-pull-refresh
            v-model="activeChannel.isLoading"
            @refresh="onRefresh"
            :success-text="refreshSuccessText">
            <van-cell-group>
              <van-list
                v-model="activeChannel.upLoading"
                :finished="activeChannel.finished"
                finished-text="没有更多了"
                @load="onLoad"
              >
                <div
                  class="article_item"
                  v-for="item in activeChannel.articles"
                  :key="item.art_id.toString()"
                >
                  <h3 class="van-ellipsis">{{item.title}}</h3>
                  <div class="img_box" v-if="item.cover.type === 3">
                    <van-image class="w33" fit="cover" lazy-load :src="item.cover.images[0]" />
                    <van-image class="w33" fit="cover" lazy-load :src="item.cover.images[1]" />
                    <van-image class="w33" fit="cover" lazy-load :src="item.cover.images[2]" />
                  </div>
                  <div class="img_box" v-if="item.cover.type === 1">
                    <van-image class="w100" fit="cover" lazy-load :src="item.cover.images[0]" />
                  </div>
                  <div class="info_box">
                    <span>{{item.aut_name}}</span>
                    <span>{{item.comm_count}}评论</span>
                    <span>{{item.pubdate | relTime}}</span>
                    <span class="close" v-if="info.token" @click="showMoreAction = true" >
                      <van-icon name="cross"></van-icon>
                    </span>
                  </div>
                </div>
              </van-list>
            </van-cell-group>
          </van-pull-refresh>
        </div>
      </van-tab>
    </van-tabs>
    <span class="bar_btn" slot="nav-right" >
      <van-icon name="wap-nav" ></van-icon>
    </span>
    <more-action v-if="info.token" v-model="showMoreAction"></more-action>
  </div>
</template>

<script>
import moreAction from './components/more-action.vue'
import { getMyChannels } from '@/api/channel.js'
import { getArticles } from '@/api/article.js'
import { mapState } from 'vuex'
export default {
  name: 'home-index',
  components: {
    moreAction
  },
  data () {
    return {
      refreshSuccessText: '',

      MyChannels: [],
      activeIndex: 0,
      showMoreAction: false
    }
  },
  computed: {
    ...mapState(['info']),
    // 当前激活的频道
    activeChannel () {
      return this.MyChannels[this.activeIndex]
    }
  },
  watch: {
    'info.refresh_token': function () {
      this.activeIndex = 0
      this.getChannels()
      this.onLoad()
    }
  },
  activated () {
    if (this.$refs['wrapper']) {
      const wrapper = this.$refs['wrapper'][this.activeIndex]
      wrapper.scrollTop = this.activeChannel.scrollTop
    }
  },

  created () {
    this.getChannels()
  },
  methods: {
    showMore () {
      console.log(1)
    },

    remember (e) {
      this.activeChannel.scrollTop = e.target.scrollTop
    },
    changeChannel () {
      if (!this.activeChannel.articles.length) {
        this.activeChannel.upLoading = true
        this.activeChannel.finished = false
        this.onLoad()
      } else {
        this.$nextTick(() => {
          const dom = this.$refs['wrapper'][this.activeIndex]
          dom.scrollTop = this.activeChannel.scrollTop
        })
      }
    },

    async getChannels () {
      const data = await getMyChannels()
      this.MyChannels = []
      this.$nextTick(() => {
        this.MyChannels = data.channels.map(item => {
          return {
            id: item.id,
            name: item.name,
            articles: [],
            upLoading: false,
            isLoading: false,
            finished: false,
            timestamp: Date.now(),
            scrollTop: 0
          }
        })
      })
    },
    async onRefresh () {
      console.log(this)
      await this.$sleep()
      this.activeChannel.timestamp = Date.now()
      const data = await getArticles(
        this.activeChannel.id,
        this.activeChannel.timestamp
      )
      console.log(data)
      this.activeChannel.isLoading = false
      // 判断是否有数据
      if (data.results.length) {
        this.activeChannel.articles = data.results
        // 加载有数据的文案
        this.refreshSuccessText = '更新成功'
        // 防止看到 没有更多了 信息 （重新刷新列表，下一页应该是有数据的）
        this.activeChannel.upLoading = false
        // 加上时间戳 加载下一页数据
        this.activeChannel.timestamp = data.pre_timestamp
        // 防止数据不够一屏 再来一次上拉加载数据 onLoad
        this.onLoad()
      } else {
        // 加载没有数据的文案
        this.refreshSuccessText = '暂无更新'
      }
    },
    async onLoad () {
      await this.$sleep()
      const data = await getArticles(
        this.activeChannel.id,
        this.activeChannel.timestamp
      )
      // 把获取的数据累加到当前频道下的文章列表中
      this.activeChannel.articles.push(...data.results)
      // 结束上拉加载效果
      this.activeChannel.upLoading = false
      // 是否所有数据已经加载完毕
      if (!data.pre_timestamp) {
        // 已经没有更多数据了
        this.activeChannel.finished = true
      } else {
        // 把后端返回的时间戳 记录下来  下次请求需要使用
        this.activeChannel.timestamp = data.pre_timestamp
      }
    }
  }
}
</script>

<style scoped lang = "less">
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;
    .scroll-wrapper {
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}

/*  */
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
