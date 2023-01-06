<template>
  <!-- TODO: This class needs to be dynamic so will need to put in vuex -->
  <div class="the-footer__width the-footer__styles">
    <div class="the-footer__copyright">
      &copy; {{ currentYear }} {{ theFooterProps.copyrightName }}
      <span class="the-footer__overflow"> All rights reserved.</span>
    </div>
    <div class="the-footer__links">
      <a href="/privacy-policy">Privacy</a>
      <a>Help Center</a>
      <span class="the-footer__overflow"><a href="/">Home</a></span>
    </div>
    <div class="the-footer__logo--position">
      <img
        id="icon-logo"
        v-if="theFooterProps.logoUrl"
        :alt="theFooterProps.logoAltText"
        :src="theFooterProps.logoUrl"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

import { AppInfoModuleName } from '@vuescape/store/modules/AppInfo'

@Component
export default class TheFooter extends Vue {
  private static readonly DefaultFooterConfig = {
    copyrightName: '',
    logoAltText  : '',
  }
  private currentYear                         = new Date().getFullYear()

  private formattedVersion = ''

  @(namespace(AppInfoModuleName).State(state => {
    return state && state.asyncResult && state.asyncResult.status === 200 && state.value
      ? state.value.version
      : undefined
  }))
  private version: string | undefined

  @(namespace('theFooter/configuration').State(state => {
    if (state && state.value) {
      const footerProps: any = state.value
      return footerProps || TheFooter.DefaultFooterConfig
    }
    return TheFooter.DefaultFooterConfig
  }))
  // TODO: define type for footer state
  private theFooterProps: any

  @Watch('version')
  private onVersionChanged(version: string, oldVersion: string) {
    // Only handle First time loaded since version in the footer should be updated with a refresh
    if (version && !this.formattedVersion) {
      this.formattedVersion = `v${this.version}`
    }
  }
}
</script>

// Using less here to avoid compile error building test when this module uses CSS
<style lang="less">
footer.v-footer {
  container-type: inline-size;
  container-name: footer;
}
@container footer (min-width: 800px) {
  .the-footer__width {
    width: 100%;
  }
}
@container footer (min-width: 1200px) {
  .the-footer__width {
    width: 1170px;
  }
}
//@container footer (min-width: 1700px) {
//  .the-footer__width {
//    width: 1500px;
//  }
//}
.the-footer__logo--position {
  position: absolute;
  left: 50%;
  width: 16px;
  margin-left: -8px;
  margin-top: 9.5px;
}

.the-footer__copyright,
.the-footer__links {
  margin-left: 0.2em;
  margin-right: 0.2em;
  margin-top: 7.5px;
}

.the-footer__styles {
  font-size: 0.90em;
  position: relative;
  height: 100%;
  clear: both;
}

.the-footer__copyright {
  left: 0px;
  float: left;
  white-space: nowrap;
}

.the-footer__links {
  float: right;
  right: 0px;
}

.the-footer__links a {
  text-decoration: none;
  color: #4183c4;
  margin-left: 1em;
}

@media (min-width: 565px) {
  .the-footer__overflow {
    display: inline;
  }

  .the-footer__copyright,
  .the-footer__links {
    margin-left: 1.5em;
    margin-right: 1.5em;
  }

  .the-footer__links a {
    margin-left: 2em;
  }
}

#icon-logo {
  width: 16px;
  height: 16px;
}

// Override container margin
.container {
  margin-left: auto;
}

.the-footer__version--center {
  padding: 4px;
}
</style>
