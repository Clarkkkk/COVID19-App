<template>
  <div id="links" class="columns is-multiline">
    <div
      class="link-container column"
      v-for="link in links"
      :key="link.name"
    >
      <div class="content">
        <a
          :href="link.url"
          target="_blank"
          rel="noopener"
        >
          {{ link.name }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.links = [{name: '国家卫健委', url: 'http:\/\/www.nhc.gov.cn\/xcs\/xxgzbd\/gzbd_index.shtml'}, {name: '山西省卫健委', url: 'http:\/\/wjw.shanxi.gov.cn\/wjywl02\/index.hrh'}, {name: '重庆市卫健委', url: 'http:\/\/wsjkw.cq.gov.cn\/tzgg\/'}, {name: '广东省卫健委', url: 'http:\/\/wsjkw.gd.gov.cn\/zwyw_yqxx\/index.html'}, {name: '陕西省卫健委', url: 'http:\/\/sxwjw.shaanxi.gov.cn\/col\/col9\/index.html'}, {name: '上海市卫健委', url: 'http:\/\/wsjkw.sh.gov.cn\/xwfb\/index.html'}, {name: '四川省卫健委', url: 'http:\/\/wsjkw.sc.gov.cn\/scwsjkw\/gggs\/tygl.shtml'}, {name: '新疆维吾尔自治区', url: 'http:\/\/www.xjhfpc.gov.cn\/tzgg_.htm'}, {name: '浙江省卫健委', url: 'http:\/\/www.zjwjw.gov.cn\/col\/col1202101\/index.html'}, {name: '山东省卫健委', url: 'http:\/\/wsjkw.shandong.gov.cn\/wzxxgk\/zwgg\/'}, {name: '西藏自治区卫健委', url: 'http:\/\/wjw.xizang.gov.cn\/xwzx\/wsjkdt\/'}, {name: '河南省卫健委', url: 'http:\/\/www.hnwsjsw.gov.cn\/channels\/177.shtml'}, {name: '安徽省卫健委', url: 'http:\/\/wjw.ah.gov.cn\/news_list_450_1.html'}, {name: '湖北省卫健委', url: 'http:\/\/wjw.hubei.gov.cn\/fbjd\/dtyw\/'}, {name: '内蒙古自治区卫健委', url: 'http:\/\/wjw.nmg.gov.cn\/xwzx\/xwfb\/index.shtml'}, {name: '黑龙江省卫健委', url: 'http:\/\/wsjkw.hlj.gov.cn\/index.php\/Home\/News\/all\/typeid\/33'}, {name: '天津市卫健委', url: 'http:\/\/wsjk.tj.gov.cn\/col\/col14\/index.html'}, {name: '云南省卫健委', url: 'http:\/\/ynswsjkw.yn.gov.cn\/wjwWebsite\/web\/col?id=UU157976428326282067&cn=xxgzbd&pcn=ztlm&pid=UU145102906505319731'}, {name: '甘肃省卫健委', url: 'http:\/\/wsjk.gansu.gov.cn\/channel\/10910\/index.html'}, {name: '福建省卫健委', url: 'https:\/\/wjw.fujian.gov.cn\/xxgk\/gzdt\/wsjsyw\/'}, {name: '广西壮族自治区卫健委', url: 'http:\/\/wsjkw.gxzf.gov.cn\/gzdt\/bt\/'}, {name: '江西省卫健委', url: 'http:\/\/hc.jiangxi.gov.cn\/xwzx\/wjxw\/index.shtml'}, {name: '青海省卫健委', url: 'https:\/\/wsjkw.qinghai.gov.cn\/ztbd\/yqjk\/index.html'}, {name: '河北省卫健委', url: 'http:\/\/www.hebwst.gov.cn\/index.do?templet=new_list&cid=14'}, {name: '北京市卫健委', url: 'http:\/\/wjw.beijing.gov.cn\/xwzx_20031\/wnxw\/'}, {name: '江苏省卫健委', url: 'http:\/\/wjw.jiangsu.gov.cn\/col\/col7290\/index.html'}, {name: '宁夏回族自治区卫健委', url: 'http:\/\/wsjkw.nx.gov.cn\/xwzx1\/xwtt.htm'}, {name: '湖南省卫健委', url: 'http:\/\/wjw.hunan.gov.cn\/wjw\/xxgk\/gzdt\/zyxw_1\/index.html'}, {name: '辽宁省卫健委', url: 'http:\/\/wsjk.ln.gov.cn\/wst_wsjskx\/'}, {name: '吉林省卫健委', url: 'http:\/\/wsjkw.jl.gov.cn\/xwzx\/'}, {name: '海南省卫健委', url: 'http:\/\/wst.hainan.gov.cn\/swjw\/ywdt\/'}, {name: '贵州省卫健委', url: 'http:\/\/www.gzhfpc.gov.cn\/xwzx_500663\/sndt\/'}, {name: '香港卫生防护中心', url: 'https:\/\/www.chp.gov.hk\/tc\/features\/102465.html'}, {name: '澳门卫生局', url: 'https:\/\/www.ssm.gov.mo\/apps1\/PreventWuhanInfection\/ch.aspx#clg17044'}, {name: '台湾卫生福利部疾病管制署', url: 'https:\/\/www.cdc.gov.tw\/Disease\/SubIndex\/N6XvFa1YP9CXYdB0kNSA9A'}, {name: '世界卫生组织', url: 'https:\/\/www.who.int\/csr\/don\/05-january-2020-pneumonia-of-unkown-cause-china\/zh\/'}];
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/extends';
@import '@/styles/variables';
#links {
  @extend %full-size;
  padding: $padding-small;
}

.link-container {
  padding: $padding-smaller;
  flex: 1 1 auto;
  transition: transform 300ms;

  &:hover {
    transform: translateY(-2px) scale(1.1);
  }

  .content {
    @extend %container;
    @extend %full-size;
    min-height: 3.2rem;
    padding: $padding-smaller;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
