<template>
  <div>
    <v-layout v-if="title" row justify-space-between class="page-header__header--separation">
      <v-flex md8 display-1>
        <span>{{title}}</span>
      </v-flex>
    </v-layout>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class PageHeader extends Vue {
  @Prop({ default: '' })
  private title: string
}
</script>

<style>
.page-header__header--separation {
  margin-bottom: 10px;
}
</style>

