<template>
  <div>
    <div v-if="item.length !== undefined">
      <hr />
      <div
        v-for="(arrayItem, key, index) in item"
        :key="index"
      >
        <div
          v-for="(propertyValue, propertyName) in arrayItem"
          :key="propertyName"
        >
          {{ propertyName }}: {{ propertyValue }}
        </div>
        <hr />
      </div>
    </div>
    <div
      v-else
      v-for="(value, key) in item"
      :key="key"
    >
      {{ key }}: {{ value }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class TextRenderer extends Vue {
  @Prop() private item: Array<object>
}
</script>
