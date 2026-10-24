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
import { Component, Prop, toNative, Vue } from '@vuescape/decorators'

@Component
class TextRenderer extends Vue {
  @Prop() private item: Array<object>
}

export default toNative(TextRenderer)
</script>
