<style>
    .question {
      margin: 10px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }

</style>
<template>
    <div class="question" v-for="q in questions" :key="q.id" >
      <router-link
        
        :key="q.id"
        :to="`quiz/${q.id}`"
        class="link"
      >
        {{ q.title }}
      </router-link>
    </div>
  </template>
  
  <script>
  import messages from "@/assets/translations";
  import { selectMessageFile } from "@/assets/translations/locale";

  let locale = navigator.language || navigator.userLanguage || "en";

  export default {
    name: "QuizzesComponent",
    data() {
      return {
        file: selectMessageFile(messages, locale),
      };
    },
    computed: {
      questions() {
        return this.file.quizzes;
      },
    },
    i18n: { messages },
  };
  </script>